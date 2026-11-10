import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiInteraction } from '../ai/entities/ai-interaction.entity';
import { LeaguesService } from '../leagues/leagues.service';
import { SocialService } from '../social/social.service';
import { User } from '../users/entities/user.entity';
import { ACHIEVEMENTS_CATALOG } from './achievements.catalog';
import { Streak } from './entities/streak.entity';
import { UserAchievement } from './entities/user-achievement.entity';
import { startOfIsoWeekUtc } from './week.util';
import { XpEvent } from './entities/xp-event.entity';
import type {
  GamificationSummary,
  RankingEntry,
  RankingResponse,
} from './gamification.types';

const EXERCISE_XP = 10;
const XP_PER_LEVEL = 100;
const NO_HINT_STREAK_TARGET = 10;
const STREAK_ACHIEVEMENT_TARGET = 7;

function previousDateString(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

@Injectable()
export class GamificationService {
  constructor(
    @InjectRepository(XpEvent)
    private readonly xpEventRepo: Repository<XpEvent>,
    @InjectRepository(Streak)
    private readonly streakRepo: Repository<Streak>,
    @InjectRepository(UserAchievement)
    private readonly achievementRepo: Repository<UserAchievement>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(AiInteraction)
    private readonly aiInteractionRepo: Repository<AiInteraction>,
    private readonly socialService: SocialService,
    private readonly leaguesService: LeaguesService,
  ) {}

  private readonly logger = new Logger(GamificationService.name);

  // Only pays XP the first time this exerciseId is passed by this user —
  // resubmitting an already-passed solution doesn't farm XP.
  async awardExerciseXp(userId: string, exerciseId: string): Promise<void> {
    const alreadyAwarded = await this.xpEventRepo.findOne({
      where: { userId, reason: 'exercise', sourceId: exerciseId },
    });
    if (alreadyAwarded) {
      return;
    }

    const isFirstEverExercise =
      (await this.xpEventRepo.count({
        where: { userId, reason: 'exercise' },
      })) === 0;

    await this.xpEventRepo.save(
      this.xpEventRepo.create({
        userId,
        amount: EXERCISE_XP,
        reason: 'exercise',
        sourceId: exerciseId,
      }),
    );
    await this.applyXpGain(userId, EXERCISE_XP);
    await this.joinLeague(userId);
    await this.recordActivity(userId);

    if (isFirstEverExercise) {
      await this.unlockAchievement(userId, 'first_exercise');
    }

    const usedHint = await this.aiInteractionRepo.findOne({
      where: { userId, exerciseId, kind: 'hint' },
    });
    const streak = await this.getOrCreateStreak(userId);
    streak.noHintStreak = usedHint ? 0 : streak.noHintStreak + 1;
    await this.streakRepo.save(streak);
    if (streak.noHintStreak >= NO_HINT_STREAK_TARGET) {
      await this.unlockAchievement(userId, 'no_hints_10');
    }
  }

  // Only pays XP the first time this lessonId is completed by this user —
  // called from the branch that already guards against duplicate UserProgress.
  async awardLessonXp(
    userId: string,
    lessonId: string,
    xpReward: number,
  ): Promise<void> {
    const alreadyAwarded = await this.xpEventRepo.findOne({
      where: { userId, reason: 'lesson', sourceId: lessonId },
    });
    if (alreadyAwarded) {
      return;
    }

    await this.xpEventRepo.save(
      this.xpEventRepo.create({
        userId,
        amount: xpReward,
        reason: 'lesson',
        sourceId: lessonId,
      }),
    );
    await this.applyXpGain(userId, xpReward);
    await this.joinLeague(userId);
    await this.recordActivity(userId);
  }

  // Puts the user in this week's league bracket so others see them even if
  // they never open the league screen. It must never undo an XP award.
  private async joinLeague(userId: string): Promise<void> {
    try {
      await this.leaguesService.ensureMembership(userId);
    } catch (error) {
      this.logger.warn(
        `Could not place ${userId} in this week's league: ${String(error)}`,
      );
    }
  }

  // Centralizes XP application so a level-up can be detected (increment()
  // alone doesn't return the pre-update value needed to compute oldLevel).
  private async applyXpGain(userId: string, amount: number): Promise<void> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const previousXp = user?.xp ?? 0;
    const oldLevel = Math.floor(previousXp / XP_PER_LEVEL);
    const newLevel = Math.floor((previousXp + amount) / XP_PER_LEVEL);

    await this.userRepo.increment({ id: userId }, 'xp', amount);

    if (newLevel > oldLevel) {
      await this.socialService.createMilestoneLevelUpPost(userId, newLevel + 1);
    }
  }

  async getSummary(userId: string): Promise<GamificationSummary> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const xp = user?.xp ?? 0;
    const streak = await this.streakRepo.findOne({ where: { userId } });
    const unlocked = await this.achievementRepo.find({ where: { userId } });
    const unlockedMap = new Map(
      unlocked.map((achievement) => [
        achievement.achievementSlug,
        achievement.unlockedAt,
      ]),
    );

    return {
      xp,
      level: Math.floor(xp / XP_PER_LEVEL) + 1,
      streak: {
        current: streak?.currentStreak ?? 0,
        longest: streak?.longestStreak ?? 0,
      },
      achievements: ACHIEVEMENTS_CATALOG.map((definition) => ({
        ...definition,
        unlockedAt: unlockedMap.get(definition.slug)?.toISOString() ?? null,
      })),
    };
  }

  async getWeeklyRanking(currentUserId: string): Promise<RankingResponse> {
    const weekStart = startOfIsoWeekUtc();
    const rows = await this.xpEventRepo
      .createQueryBuilder('event')
      // XpEvent.userId is varchar while User.id is uuid — Postgres rejects a
      // bare `=` across those types (same mismatch fixed for concept-stats).
      .innerJoin(
        User,
        'rankedUser',
        'CAST(rankedUser.id AS varchar) = event.userId',
      )
      .select('event.userId', 'userId')
      .addSelect('rankedUser.displayName', 'displayName')
      .addSelect('SUM(event.amount)', 'weeklyXp')
      .where('event.createdAt >= :weekStart', { weekStart })
      .groupBy('event.userId')
      .addGroupBy('rankedUser.displayName')
      .orderBy('"weeklyXp"', 'DESC')
      .getRawMany<{ userId: string; displayName: string; weeklyXp: string }>();

    const ranked: RankingEntry[] = rows.map((row, index) => ({
      userId: row.userId,
      displayName: row.displayName,
      weeklyXp: Number(row.weeklyXp),
      rank: index + 1,
    }));

    const me =
      ranked.find((entry) => entry.userId === currentUserId) ??
      (await this.buildFallbackRankingEntry(currentUserId, ranked.length + 1));

    return { top: ranked.slice(0, 10), me };
  }

  private async buildFallbackRankingEntry(
    userId: string,
    rank: number,
  ): Promise<RankingEntry> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    return { userId, displayName: user?.displayName ?? '', weeklyXp: 0, rank };
  }

  private async recordActivity(userId: string): Promise<void> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const today = new Date().toLocaleDateString('en-CA', {
      timeZone: user?.timezone ?? 'UTC',
    });

    const streak = await this.getOrCreateStreak(userId);
    if (streak.lastActivityDate === today) {
      return;
    }

    streak.currentStreak =
      streak.lastActivityDate === previousDateString(today)
        ? streak.currentStreak + 1
        : 1;
    streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
    streak.lastActivityDate = today;
    await this.streakRepo.save(streak);

    if (streak.currentStreak >= STREAK_ACHIEVEMENT_TARGET) {
      await this.unlockAchievement(userId, 'streak_7');
    }
  }

  private async getOrCreateStreak(userId: string): Promise<Streak> {
    const existing = await this.streakRepo.findOne({ where: { userId } });
    if (existing) {
      return existing;
    }
    return this.streakRepo.save(this.streakRepo.create({ userId }));
  }

  private async unlockAchievement(userId: string, slug: string): Promise<void> {
    const existing = await this.achievementRepo.findOne({
      where: { userId, achievementSlug: slug },
    });
    if (existing) {
      return;
    }
    await this.achievementRepo.save(
      this.achievementRepo.create({ userId, achievementSlug: slug }),
    );
    await this.socialService.createMilestoneAchievementPost(userId, slug);
  }
}
