import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThan, QueryFailedError, Repository } from 'typeorm';
import { XpEvent } from '../gamification/entities/xp-event.entity';
import { startOfIsoWeekUtc } from '../gamification/week.util';
import { sumXpByUser } from '../gamification/xp-sum.util';
import { User } from '../users/entities/user.entity';
import { LeagueGroup } from './entities/league-group.entity';
import { LeagueMembership } from './entities/league-membership.entity';
import {
  LEAGUE_GROUP_SIZE,
  MAX_TIER,
  nextTier,
  nextWeekStart,
  previousWeekStart,
  rankEntries,
  resultFor,
  weekKey,
  zoneFor,
  zoneSize,
} from './league-rules';
import type {
  LeagueDto,
  LeagueLastWeekDto,
  LeagueMemberDto,
} from './leagues.types';

const POSTGRES_UNIQUE_VIOLATION = '23505';

function isUniqueViolation(error: unknown): boolean {
  return (
    error instanceof QueryFailedError &&
    (error.driverError as { code?: string } | undefined)?.code ===
      POSTGRES_UNIQUE_VIOLATION
  );
}

// Leagues are resolved lazily instead of by a weekly cron job: a user's
// bracket for the current week is created the first time anything asks for it
// (opening the league, or earning XP), using last week's final standings.
@Injectable()
export class LeaguesService {
  constructor(
    @InjectRepository(LeagueGroup)
    private readonly groupRepo: Repository<LeagueGroup>,
    @InjectRepository(LeagueMembership)
    private readonly memberRepo: Repository<LeagueMembership>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(XpEvent)
    private readonly xpEventRepo: Repository<XpEvent>,
  ) {}

  async ensureMembership(userId: string): Promise<LeagueMembership> {
    const weekStart = startOfIsoWeekUtc();
    const key = weekKey(weekStart);

    const existing = await this.memberRepo.findOne({
      where: { userId, weekStart: key },
    });
    if (existing) {
      return existing;
    }

    const tier = await this.startingTier(userId, weekStart);
    const group = await this.findOrCreateGroup(key, tier);
    try {
      return await this.memberRepo.save(
        this.memberRepo.create({
          userId,
          groupId: group.id,
          weekStart: key,
          tier,
        }),
      );
    } catch (error) {
      // Two requests for the same user raced past the check above.
      if (isUniqueViolation(error)) {
        const raced = await this.memberRepo.findOne({
          where: { userId, weekStart: key },
        });
        if (raced) {
          return raced;
        }
      }
      throw error;
    }
  }

  async getMyLeague(userId: string): Promise<LeagueDto> {
    const membership = await this.ensureMembership(userId);
    const weekStart = startOfIsoWeekUtc();

    const memberships = await this.memberRepo.find({
      where: { groupId: membership.groupId },
    });
    const userIds = memberships.map((entry) => entry.userId);
    const [users, xpByUser] = await Promise.all([
      this.userRepo.find({ where: { id: In(userIds) } }),
      sumXpByUser(this.xpEventRepo, userIds, weekStart),
    ]);
    const userById = new Map(users.map((user) => [user.id, user]));

    const ranked = rankEntries(
      memberships.map((entry) => ({
        userId: entry.userId,
        joinedAt: entry.createdAt,
        xp: xpByUser.get(entry.userId) ?? 0,
      })),
    );

    const members: LeagueMemberDto[] = [];
    for (const entry of ranked) {
      const user = userById.get(entry.userId);
      if (!user) {
        continue;
      }
      members.push({
        userId: entry.userId,
        displayName: user.displayName,
        username: user.username,
        avatarIcon: user.avatarIcon,
        avatarColor: user.avatarColor,
        weeklyXp: entry.xp,
        rank: entry.rank,
        isMe: entry.userId === userId,
        zone: zoneFor(entry.rank, ranked.length, membership.tier, entry.xp),
      });
    }

    const previous = await this.memberRepo.findOne({
      where: { userId, weekStart: weekKey(previousWeekStart(weekStart)) },
    });

    return {
      tier: membership.tier,
      maxTier: MAX_TIER,
      weekStart: weekStart.toISOString(),
      weekEnd: nextWeekStart(weekStart).toISOString(),
      zoneSize: zoneSize(ranked.length),
      members,
      lastWeek: previous ? await this.resolveOutcome(previous) : null,
    };
  }

  // The tier a user starts the week in: last week's result if they played
  // last week, otherwise one tier down for having skipped (or the bottom
  // tier for a brand-new user).
  private async startingTier(userId: string, weekStart: Date): Promise<number> {
    const latest = await this.memberRepo.findOne({
      where: { userId, weekStart: LessThan(weekKey(weekStart)) },
      order: { weekStart: 'DESC' },
    });
    if (!latest) {
      return 0;
    }
    if (latest.weekStart === weekKey(previousWeekStart(weekStart))) {
      return (await this.resolveOutcome(latest)).toTier;
    }
    return Math.max(0, latest.tier - 1);
  }

  // Final standings of a finished week's bracket, from that week's XP only.
  private async resolveOutcome(
    previous: LeagueMembership,
  ): Promise<LeagueLastWeekDto> {
    const start = new Date(`${previous.weekStart}T00:00:00Z`);
    const memberships = await this.memberRepo.find({
      where: { groupId: previous.groupId },
    });
    const xpByUser = await sumXpByUser(
      this.xpEventRepo,
      memberships.map((entry) => entry.userId),
      start,
      nextWeekStart(start),
    );

    const ranked = rankEntries(
      memberships.map((entry) => ({
        userId: entry.userId,
        joinedAt: entry.createdAt,
        xp: xpByUser.get(entry.userId) ?? 0,
      })),
    );
    const mine = ranked.find((entry) => entry.userId === previous.userId);
    const rank = mine?.rank ?? ranked.length;
    const result = resultFor(
      zoneFor(rank, ranked.length, previous.tier, mine?.xp ?? 0),
    );

    return {
      result,
      fromTier: previous.tier,
      toTier: nextTier(previous.tier, result),
      rank,
      size: ranked.length,
    };
  }

  // Fills the fullest open bracket of this tier before opening a new one, so
  // people end up in full brackets rather than spread thin.
  private async findOrCreateGroup(
    key: string,
    tier: number,
  ): Promise<LeagueGroup> {
    const open = await this.groupRepo
      .createQueryBuilder('league')
      .leftJoin(LeagueMembership, 'member', 'member.groupId = league.id')
      .select('league.id', 'id')
      .where('league.weekStart = :key', { key })
      .andWhere('league.tier = :tier', { tier })
      .groupBy('league.id')
      .having('COUNT(member.id) < :max', { max: LEAGUE_GROUP_SIZE })
      .orderBy('COUNT(member.id)', 'DESC')
      .limit(1)
      .getRawOne<{ id: string }>();

    if (open) {
      return this.groupRepo.findOneByOrFail({ id: open.id });
    }
    return this.groupRepo.save(this.groupRepo.create({ weekStart: key, tier }));
  }
}
