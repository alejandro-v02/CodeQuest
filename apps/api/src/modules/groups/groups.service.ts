import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Streak } from '../gamification/entities/streak.entity';
import { XpEvent } from '../gamification/entities/xp-event.entity';
import { startOfIsoWeekUtc } from '../gamification/week.util';
import { sumXpByUser } from '../gamification/xp-sum.util';
import { User } from '../users/entities/user.entity';
import { GroupMember } from './entities/group-member.entity';
import { Group } from './entities/group.entity';
import type {
  GroupDetailDto,
  GroupMemberDto,
  GroupRankingEntryDto,
  GroupRankingResponse,
  GroupSummaryDto,
} from './groups.types';

const XP_PER_LEVEL = 100;
const MAX_OWNED_GROUPS = 5;
const MAX_JOINED_GROUPS = 10;
const MAX_MEMBERS = 100;
const STALLED_AFTER_DAYS = 7;
const NEW_MEMBER_GRACE_DAYS = 3;
const MIN_MEMBERS_FOR_RANKING = 3;
const RANKING_TOP_SIZE = 10;
const DAY_MS = 24 * 60 * 60 * 1000;
// No 0/O or 1/I so a code read aloud or copied from a board isn't ambiguous.
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 6;

function randomCode(): string {
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i += 1) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return code;
}

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepo: Repository<Group>,
    @InjectRepository(GroupMember)
    private readonly memberRepo: Repository<GroupMember>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(XpEvent)
    private readonly xpEventRepo: Repository<XpEvent>,
    @InjectRepository(Streak)
    private readonly streakRepo: Repository<Streak>,
  ) {}

  async create(userId: string, name: string): Promise<GroupSummaryDto> {
    const creator = await this.userRepo.findOne({ where: { id: userId } });
    if (!creator?.isInstructor) {
      throw new ForbiddenException(
        'Solo los instructores verificados pueden crear fichas.',
      );
    }

    const owned = await this.groupRepo.count({ where: { ownerId: userId } });
    if (owned >= MAX_OWNED_GROUPS) {
      throw new BadRequestException(
        `Solo puedes crear hasta ${MAX_OWNED_GROUPS} fichas.`,
      );
    }

    const group = await this.groupRepo.save(
      this.groupRepo.create({
        name: name.trim(),
        code: await this.generateUniqueCode(),
        ownerId: userId,
      }),
    );
    await this.memberRepo.save(
      this.memberRepo.create({ groupId: group.id, userId }),
    );

    return this.buildSummary(group, userId);
  }

  async join(userId: string, rawCode: string): Promise<GroupSummaryDto> {
    const group = await this.groupRepo.findOne({
      where: { code: rawCode.trim().toUpperCase() },
    });
    if (!group) {
      throw new NotFoundException('Ese código de ficha no existe.');
    }

    const alreadyMember = await this.memberRepo.findOne({
      where: { groupId: group.id, userId },
    });
    if (alreadyMember) {
      return this.buildSummary(group, userId);
    }

    const joined = await this.memberRepo.count({ where: { userId } });
    if (joined >= MAX_JOINED_GROUPS) {
      throw new BadRequestException(
        `Solo puedes estar en ${MAX_JOINED_GROUPS} fichas a la vez.`,
      );
    }
    const members = await this.memberRepo.count({
      where: { groupId: group.id },
    });
    if (members >= MAX_MEMBERS) {
      throw new BadRequestException('Esa ficha ya está llena.');
    }

    await this.memberRepo.save(
      this.memberRepo.create({ groupId: group.id, userId }),
    );
    return this.buildSummary(group, userId);
  }

  async listMine(userId: string): Promise<GroupSummaryDto[]> {
    const memberships = await this.memberRepo.find({ where: { userId } });
    if (memberships.length === 0) {
      return [];
    }

    const groups = await this.groupRepo.find({
      where: { id: In(memberships.map((m) => m.groupId)) },
    });
    const summaries = await Promise.all(
      groups.map((group) => this.buildSummary(group, userId)),
    );
    return summaries.sort((a, b) => a.name.localeCompare(b.name));
  }

  async getDetail(userId: string, groupId: string): Promise<GroupDetailDto> {
    const group = await this.requireGroup(groupId);
    await this.requireMembership(groupId, userId);

    const isOwner = group.ownerId === userId;
    const members = await this.buildMembers(group, userId, isOwner);
    const summary = await this.buildSummary(group, userId, members);

    return {
      ...summary,
      activeThisWeek: members.filter((member) => member.weeklyXp > 0).length,
      members,
    };
  }

  async leave(userId: string, groupId: string): Promise<void> {
    const group = await this.requireGroup(groupId);
    await this.requireMembership(groupId, userId);
    if (group.ownerId === userId) {
      throw new BadRequestException(
        'La persona que creó la ficha no puede salir; elimínala en su lugar.',
      );
    }
    await this.memberRepo.delete({ groupId, userId });
  }

  async remove(userId: string, groupId: string): Promise<void> {
    const group = await this.requireGroup(groupId);
    this.assertOwner(group, userId);
    await this.memberRepo.delete({ groupId });
    await this.groupRepo.delete({ id: groupId });
  }

  async removeMember(
    userId: string,
    groupId: string,
    memberUserId: string,
  ): Promise<void> {
    const group = await this.requireGroup(groupId);
    this.assertOwner(group, userId);
    if (memberUserId === group.ownerId) {
      throw new BadRequestException('No puedes expulsarte de tu propia ficha.');
    }
    await this.memberRepo.delete({ groupId, userId: memberUserId });
  }

  // Groups compete on average weekly XP per member (so a big group doesn't win
  // just by being big); groups under MIN_MEMBERS_FOR_RANKING sit out so a lone
  // account can't top the board.
  async getRanking(userId: string): Promise<GroupRankingResponse> {
    const allMembers = await this.memberRepo.find();
    const membersByGroup = new Map<string, string[]>();
    for (const member of allMembers) {
      const list = membersByGroup.get(member.groupId) ?? [];
      list.push(member.userId);
      membersByGroup.set(member.groupId, list);
    }

    const eligibleIds = [...membersByGroup.entries()]
      .filter(([, ids]) => ids.length >= MIN_MEMBERS_FOR_RANKING)
      .map(([groupId]) => groupId);
    if (eligibleIds.length === 0) {
      return { top: [], mine: null };
    }

    const groups = await this.groupRepo.find({
      where: { id: In(eligibleIds) },
    });
    const weeklyXp = await this.weeklyXpByUser([
      ...new Set(eligibleIds.flatMap((id) => membersByGroup.get(id) ?? [])),
    ]);

    const myGroupIds = new Set(
      allMembers.filter((m) => m.userId === userId).map((m) => m.groupId),
    );
    const entries: GroupRankingEntryDto[] = groups
      .map((group) => {
        const ids = membersByGroup.get(group.id) ?? [];
        const total = ids.reduce((sum, id) => sum + (weeklyXp.get(id) ?? 0), 0);
        return {
          groupId: group.id,
          name: group.name,
          memberCount: ids.length,
          averageWeeklyXp: Math.round(total / ids.length),
          rank: 0,
          isMine: myGroupIds.has(group.id),
        };
      })
      .sort(
        (a, b) =>
          b.averageWeeklyXp - a.averageWeeklyXp || a.name.localeCompare(b.name),
      )
      .map((entry, index) => ({ ...entry, rank: index + 1 }));

    return {
      top: entries.slice(0, RANKING_TOP_SIZE),
      mine: entries.find((entry) => entry.isMine) ?? null,
    };
  }

  private async buildSummary(
    group: Group,
    userId: string,
    knownMembers?: GroupMemberDto[],
  ): Promise<GroupSummaryDto> {
    const members =
      knownMembers ?? (await this.buildMembers(group, userId, false));
    return {
      id: group.id,
      name: group.name,
      role: group.ownerId === userId ? 'owner' : 'member',
      memberCount: members.length,
      weeklyXp: members.reduce((sum, member) => sum + member.weeklyXp, 0),
      code: group.ownerId === userId ? group.code : null,
    };
  }

  private async buildMembers(
    group: Group,
    viewerId: string,
    viewerIsOwner: boolean,
  ): Promise<GroupMemberDto[]> {
    const memberships = await this.memberRepo.find({
      where: { groupId: group.id },
    });
    const userIds = memberships.map((membership) => membership.userId);
    if (userIds.length === 0) {
      return [];
    }

    const [users, streaks, weeklyXp] = await Promise.all([
      this.userRepo.find({ where: { id: In(userIds) } }),
      this.streakRepo.find({ where: { userId: In(userIds) } }),
      this.weeklyXpByUser(userIds),
    ]);
    const userById = new Map(users.map((user) => [user.id, user]));
    const streakByUser = new Map(streaks.map((s) => [s.userId, s]));
    const joinedAtByUser = new Map(
      memberships.map((membership) => [membership.userId, membership.joinedAt]),
    );

    const now = Date.now();
    const stalledCutoff = new Date(now - STALLED_AFTER_DAYS * DAY_MS)
      .toISOString()
      .slice(0, 10);

    const rows = userIds
      .map((userId) => {
        const user = userById.get(userId);
        if (!user) {
          return null;
        }
        const streak = streakByUser.get(userId);
        const lastActivityDate = streak?.lastActivityDate ?? null;
        const joinedAt = joinedAtByUser.get(userId) ?? new Date(now);
        const pastGracePeriod =
          now - joinedAt.getTime() > NEW_MEMBER_GRACE_DAYS * DAY_MS;
        const inactive =
          lastActivityDate === null || lastActivityDate < stalledCutoff;

        return {
          userId,
          displayName: user.displayName,
          username: user.username,
          avatarIcon: user.avatarIcon,
          avatarColor: user.avatarColor,
          level: Math.floor(user.xp / XP_PER_LEVEL) + 1,
          totalXp: user.xp,
          weeklyXp: weeklyXp.get(userId) ?? 0,
          currentStreak: streak?.currentStreak ?? 0,
          lastActivityDate,
          isOwner: userId === group.ownerId,
          isMe: userId === viewerId,
          isStalled:
            viewerIsOwner &&
            userId !== group.ownerId &&
            inactive &&
            pastGracePeriod,
        };
      })
      .filter((row): row is NonNullable<typeof row> => row !== null)
      .sort(
        (a, b) =>
          b.weeklyXp - a.weeklyXp ||
          b.totalXp - a.totalXp ||
          a.displayName.localeCompare(b.displayName),
      );

    return rows.map((row, index) => ({ ...row, rank: index + 1 }));
  }

  private weeklyXpByUser(userIds: string[]): Promise<Map<string, number>> {
    return sumXpByUser(this.xpEventRepo, userIds, startOfIsoWeekUtc());
  }

  private async generateUniqueCode(): Promise<string> {
    for (let attempt = 0; attempt < 10; attempt += 1) {
      const code = randomCode();
      if (!(await this.groupRepo.exists({ where: { code } }))) {
        return code;
      }
    }
    throw new BadRequestException(
      'No se pudo generar un código único, inténtalo de nuevo.',
    );
  }

  private async requireGroup(groupId: string): Promise<Group> {
    const group = await this.groupRepo.findOne({ where: { id: groupId } });
    if (!group) {
      throw new NotFoundException('Esa ficha no existe.');
    }
    return group;
  }

  private async requireMembership(
    groupId: string,
    userId: string,
  ): Promise<void> {
    const membership = await this.memberRepo.findOne({
      where: { groupId, userId },
    });
    if (!membership) {
      throw new ForbiddenException('No perteneces a esta ficha.');
    }
  }

  private assertOwner(group: Group, userId: string): void {
    if (group.ownerId !== userId) {
      throw new ForbiddenException(
        'Solo quien creó la ficha puede hacer esto.',
      );
    }
  }
}
