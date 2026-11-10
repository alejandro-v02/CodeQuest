import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, IsNull, LessThan, Not, Repository } from 'typeorm';
import { Attempt } from '../exercises/entities/attempt.entity';
import { ACHIEVEMENTS_CATALOG } from '../gamification/achievements.catalog';
import { User } from '../users/entities/user.entity';
import type { CreatePostDto } from './dto/create-post.dto';
import type { CreateSocialReportDto } from './dto/create-social-report.dto';
import { Follow } from './entities/follow.entity';
import { Notification, type NotificationType } from './entities/notification.entity';
import { Post } from './entities/post.entity';
import { PostComment } from './entities/post-comment.entity';
import {
  PostReaction,
  type ReactionIcon,
} from './entities/post-reaction.entity';
import { PostReport } from './entities/post-report.entity';
import type {
  CommentDto,
  FeedPage,
  HeatmapDay,
  NotificationDto,
  PostDto,
  ProfileResponse,
  ReactionSummary,
  UserResultDto,
} from './social.types';

const XP_PER_LEVEL = 100;
const DEFAULT_FEED_LIMIT = 20;
const MAX_FEED_LIMIT = 50;
const COMMENT_LIMIT = 100;
const HEATMAP_DAYS = 365;
const SEARCH_RESULT_LIMIT = 20;
const SUGGESTIONS_LIMIT = 6;
const DEFAULT_NOTIFICATIONS_LIMIT = 30;
const MAX_NOTIFICATIONS_LIMIT = 50;

@Injectable()
export class SocialService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    @InjectRepository(Follow)
    private readonly followRepo: Repository<Follow>,
    @InjectRepository(PostReaction)
    private readonly reactionRepo: Repository<PostReaction>,
    @InjectRepository(PostComment)
    private readonly commentRepo: Repository<PostComment>,
    @InjectRepository(PostReport)
    private readonly reportRepo: Repository<PostReport>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Attempt)
    private readonly attemptRepo: Repository<Attempt>,
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {}

  async follow(followerId: string, followeeId: string): Promise<void> {
    if (followerId === followeeId) {
      throw new BadRequestException('You cannot follow yourself.');
    }
    const existing = await this.followRepo.findOne({
      where: { followerId, followeeId },
    });
    if (existing) {
      return;
    }
    await this.followRepo.save(
      this.followRepo.create({ followerId, followeeId }),
    );
    await this.createNotification(followeeId, followerId, 'follow');
  }

  async unfollow(followerId: string, followeeId: string): Promise<void> {
    await this.followRepo.delete({ followerId, followeeId });
  }

  async searchUsers(viewerId: string, query: string): Promise<UserResultDto[]> {
    const trimmed = query.trim();
    if (trimmed.length === 0) {
      return [];
    }

    const matches = await this.userRepo.find({
      where: [
        { id: Not(viewerId), username: ILike(`%${trimmed}%`) },
        { id: Not(viewerId), displayName: ILike(`%${trimmed}%`) },
      ],
      take: SEARCH_RESULT_LIMIT,
    });

    // Exact/prefix username matches first — more useful than displayName
    // hits when someone is searching for a specific person to follow.
    const lower = trimmed.toLowerCase();
    matches.sort(
      (a, b) =>
        this.usernameMatchRank(a, lower) - this.usernameMatchRank(b, lower),
    );

    return this.toUserResults(matches, viewerId);
  }

  async getSuggestions(viewerId: string): Promise<UserResultDto[]> {
    const follows = await this.followRepo.find({
      where: { followerId: viewerId },
    });
    const excludeIds = [viewerId, ...follows.map((f) => f.followeeId)];

    const candidates = await this.userRepo
      .createQueryBuilder('user')
      .where('user.id NOT IN (:...excludeIds)', { excludeIds })
      .orderBy('RANDOM()')
      .limit(SUGGESTIONS_LIMIT)
      .getMany();

    return this.toUserResults(candidates, viewerId);
  }

  private usernameMatchRank(user: User, lowerQuery: string): number {
    const username = user.username?.toLowerCase() ?? '';
    if (username === lowerQuery) return 0;
    if (username.startsWith(lowerQuery)) return 1;
    if (username.includes(lowerQuery)) return 2;
    return 3;
  }

  private async toUserResults(
    users: User[],
    viewerId: string,
  ): Promise<UserResultDto[]> {
    if (users.length === 0) {
      return [];
    }
    const follows = await this.followRepo.find({
      where: { followerId: viewerId, followeeId: In(users.map((u) => u.id)) },
    });
    const followedIds = new Set(follows.map((f) => f.followeeId));

    return users.map((user) => ({
      userId: user.id,
      displayName: user.displayName,
      username: user.username,
      avatarIcon: user.avatarIcon,
      avatarColor: user.avatarColor,
      isFollowedByMe: followedIds.has(user.id),
    }));
  }

  async getProfile(
    viewerId: string,
    targetUserId: string,
  ): Promise<ProfileResponse> {
    const target = await this.userRepo.findOne({ where: { id: targetUserId } });
    if (!target) {
      throw new NotFoundException('User not found.');
    }

    const isSelf = viewerId === targetUserId;
    const isFollowedByMe = isSelf
      ? false
      : (await this.followRepo.findOne({
          where: { followerId: viewerId, followeeId: targetUserId },
        })) !== null;
    const unlocked = isSelf || isFollowedByMe;
    const { followersCount, followingCount } =
      await this.getFollowCounts(targetUserId);

    const response: ProfileResponse = {
      userId: target.id,
      displayName: target.displayName,
      avatarIcon: target.avatarIcon,
      avatarColor: target.avatarColor,
      level: Math.floor(target.xp / XP_PER_LEVEL) + 1,
      isSelf,
      isFollowedByMe,
      followersCount,
      followingCount,
      unlocked,
    };

    if (unlocked) {
      response.bio = target.bio;
      response.pinnedAchievement = target.pinnedAchievementSlug
        ? (ACHIEVEMENTS_CATALOG.find(
            (a) => a.slug === target.pinnedAchievementSlug,
          ) ?? null)
        : null;
    }

    return response;
  }

  // Sparse result — only days with at least one Attempt are included. The
  // client fills the rest of the HEATMAP_DAYS-day range with zero, which
  // avoids generating/transferring ~365 mostly-empty rows per profile view.
  async getHeatmap(
    viewerId: string,
    targetUserId: string,
  ): Promise<HeatmapDay[]> {
    await this.assertUnlockedOrThrow(viewerId, targetUserId);

    const since = new Date();
    since.setUTCDate(since.getUTCDate() - HEATMAP_DAYS);

    const rows = await this.attemptRepo
      .createQueryBuilder('attempt')
      .select('DATE(attempt.createdAt)', 'date')
      .addSelect('COUNT(*)', 'count')
      .where('attempt.userId = :userId', { userId: targetUserId })
      .andWhere('attempt.createdAt >= :since', { since })
      .groupBy('DATE(attempt.createdAt)')
      .getRawMany<{ date: string; count: string }>();

    return rows.map((row) => ({ date: row.date, count: Number(row.count) }));
  }

  async getWall(
    viewerId: string,
    targetUserId: string,
    before: string | undefined,
    limit: number,
  ): Promise<FeedPage> {
    await this.assertUnlockedOrThrow(viewerId, targetUserId);
    return this.paginatePosts(
      { authorId: targetUserId },
      before,
      limit,
      viewerId,
    );
  }

  async getFeed(
    viewerId: string,
    before: string | undefined,
    limit: number,
  ): Promise<FeedPage> {
    const follows = await this.followRepo.find({
      where: { followerId: viewerId },
    });
    const authorIds = [viewerId, ...follows.map((f) => f.followeeId)];
    return this.paginatePosts(
      { authorId: In(authorIds) },
      before,
      limit,
      viewerId,
    );
  }

  private async paginatePosts(
    where: Record<string, unknown>,
    before: string | undefined,
    limit: number,
    viewerId: string,
  ): Promise<FeedPage> {
    const pageSize = Math.min(
      Math.max(limit || DEFAULT_FEED_LIMIT, 1),
      MAX_FEED_LIMIT,
    );
    const clause = before
      ? { ...where, createdAt: LessThan(new Date(before)) }
      : where;

    const rows = await this.postRepo.find({
      where: clause,
      order: { createdAt: 'DESC' },
      take: pageSize + 1,
    });

    const hasMore = rows.length > pageSize;
    const page = hasMore ? rows.slice(0, pageSize) : rows;
    const items = await this.hydratePosts(page, viewerId);
    const nextCursor = hasMore
      ? page[page.length - 1].createdAt.toISOString()
      : null;

    return { items, nextCursor };
  }

  async createPost(authorId: string, dto: CreatePostDto): Promise<PostDto> {
    if (dto.type === 'solved_exercise') {
      if (!dto.exerciseId) {
        throw new BadRequestException(
          'exerciseId is required to share a solved exercise.',
        );
      }
      const passedAttempt = await this.attemptRepo.findOne({
        where: { userId: authorId, exerciseId: dto.exerciseId, passed: true },
      });
      if (!passedAttempt) {
        throw new BadRequestException(
          'You can only share an exercise you solved.',
        );
      }
    }

    const post = await this.postRepo.save(
      this.postRepo.create({
        authorId,
        type: dto.type,
        body: dto.type === 'text' ? (dto.body ?? null) : (dto.caption ?? null),
        codeSnippet: dto.codeSnippet ?? null,
        exerciseId: dto.exerciseId ?? null,
        exerciseTitle: dto.exerciseTitle ?? null,
        achievementSlug: null,
        level: null,
      }),
    );

    const [hydrated] = await this.hydratePosts([post], authorId);
    return hydrated;
  }

  async deletePost(authorId: string, postId: string): Promise<void> {
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found.');
    }
    if (post.authorId !== authorId) {
      throw new ForbiddenException('You can only delete your own posts.');
    }
    // No FK/cascade (plain uuid columns, consistent with this codebase's
    // no-relations convention) — clean up child rows manually.
    await this.reactionRepo.delete({ postId });
    await this.commentRepo.delete({ postId });
    await this.postRepo.delete({ id: postId });
  }

  async createMilestoneAchievementPost(
    userId: string,
    achievementSlug: string,
  ): Promise<void> {
    await this.postRepo.save(
      this.postRepo.create({
        authorId: userId,
        type: 'achievement',
        achievementSlug,
      }),
    );
  }

  async createMilestoneLevelUpPost(
    userId: string,
    level: number,
  ): Promise<void> {
    await this.postRepo.save(
      this.postRepo.create({
        authorId: userId,
        type: 'level_up',
        level,
      }),
    );
  }

  async setReaction(
    userId: string,
    postId: string,
    icon: ReactionIcon,
  ): Promise<void> {
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found.');
    }
    const existing = await this.reactionRepo.findOne({
      where: { postId, userId },
    });
    if (existing) {
      existing.icon = icon;
      await this.reactionRepo.save(existing);
      await this.createNotification(post.authorId, userId, 'reaction', postId);
      return;
    }
    await this.reactionRepo.save(
      this.reactionRepo.create({ postId, userId, icon }),
    );
    await this.createNotification(post.authorId, userId, 'reaction', postId);
  }

  async removeReaction(userId: string, postId: string): Promise<void> {
    await this.reactionRepo.delete({ postId, userId });
  }

  async addComment(
    authorId: string,
    postId: string,
    body: string,
  ): Promise<CommentDto> {
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found.');
    }
    const comment = await this.commentRepo.save(
      this.commentRepo.create({ postId, authorId, body }),
    );
    await this.createNotification(post.authorId, authorId, 'comment', postId);
    const author = await this.userRepo.findOne({ where: { id: authorId } });
    return this.toCommentDto(comment, author);
  }

  async getComments(postId: string): Promise<CommentDto[]> {
    const comments = await this.commentRepo.find({
      where: { postId },
      order: { createdAt: 'ASC' },
      take: COMMENT_LIMIT,
    });
    if (comments.length === 0) {
      return [];
    }
    const authorIds = [...new Set(comments.map((c) => c.authorId))];
    const authors = await this.userRepo.findBy({ id: In(authorIds) });
    const authorMap = new Map(authors.map((a) => [a.id, a]));
    return comments.map((comment) =>
      this.toCommentDto(comment, authorMap.get(comment.authorId)),
    );
  }

  async deleteComment(authorId: string, commentId: string): Promise<void> {
    const comment = await this.commentRepo.findOne({
      where: { id: commentId },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found.');
    }
    if (comment.authorId !== authorId) {
      throw new ForbiddenException('You can only delete your own comments.');
    }
    await this.commentRepo.delete({ id: commentId });
  }

  async report(reporterId: string, dto: CreateSocialReportDto): Promise<void> {
    await this.reportRepo.save(
      this.reportRepo.create({
        reporterId,
        targetType: dto.targetType,
        targetId: dto.targetId,
        reason: dto.reason,
        details: dto.details ?? null,
      }),
    );
  }

  async getNotifications(
    userId: string,
    limit?: number,
  ): Promise<NotificationDto[]> {
    const pageSize = Math.min(
      Math.max(limit || DEFAULT_NOTIFICATIONS_LIMIT, 1),
      MAX_NOTIFICATIONS_LIMIT,
    );
    const notifications = await this.notificationRepo.find({
      where: { recipientId: userId },
      order: { createdAt: 'DESC' },
      take: pageSize,
    });
    if (notifications.length === 0) {
      return [];
    }
    const actorIds = [...new Set(notifications.map((n) => n.actorId))];
    const actors = await this.userRepo.findBy({ id: In(actorIds) });
    const actorMap = new Map(actors.map((a) => [a.id, a]));

    return notifications.map((notification) => {
      const actor = actorMap.get(notification.actorId);
      return {
        id: notification.id,
        type: notification.type,
        actorId: notification.actorId,
        actorDisplayName: actor?.displayName ?? '',
        actorAvatarIcon: actor?.avatarIcon ?? 'person-circle',
        actorAvatarColor: actor?.avatarColor ?? '#22d3ee',
        postId: notification.postId,
        createdAt: notification.createdAt.toISOString(),
        read: notification.readAt !== null,
      };
    });
  }

  getUnreadNotificationsCount(userId: string): Promise<number> {
    return this.notificationRepo.count({
      where: { recipientId: userId, readAt: IsNull() },
    });
  }

  async markAllNotificationsRead(userId: string): Promise<void> {
    await this.notificationRepo.update(
      { recipientId: userId, readAt: IsNull() },
      { readAt: new Date() },
    );
  }

  private async createNotification(
    recipientId: string,
    actorId: string,
    type: NotificationType,
    postId: string | null = null,
  ): Promise<void> {
    if (recipientId === actorId) {
      return;
    }
    await this.notificationRepo.save(
      this.notificationRepo.create({ recipientId, actorId, type, postId }),
    );
  }

  private async assertUnlockedOrThrow(
    viewerId: string,
    targetUserId: string,
  ): Promise<void> {
    if (viewerId === targetUserId) {
      return;
    }
    const follows = await this.followRepo.findOne({
      where: { followerId: viewerId, followeeId: targetUserId },
    });
    if (!follows) {
      throw new ForbiddenException('Follow this user to see their profile.');
    }
  }

  private async getFollowCounts(
    userId: string,
  ): Promise<{ followersCount: number; followingCount: number }> {
    const [followersCount, followingCount] = await Promise.all([
      this.followRepo.count({ where: { followeeId: userId } }),
      this.followRepo.count({ where: { followerId: userId } }),
    ]);
    return { followersCount, followingCount };
  }

  private async hydratePosts(
    posts: Post[],
    viewerId: string,
  ): Promise<PostDto[]> {
    if (posts.length === 0) {
      return [];
    }
    const postIds = posts.map((p) => p.id);
    const authorIds = [...new Set(posts.map((p) => p.authorId))];

    const [authors, reactionRows, myReactions, commentCountRows] =
      await Promise.all([
        this.userRepo.findBy({ id: In(authorIds) }),
        this.reactionRepo
          .createQueryBuilder('r')
          .select('r.postId', 'postId')
          .addSelect('r.icon', 'icon')
          .addSelect('COUNT(*)', 'count')
          .where('r.postId IN (:...postIds)', { postIds })
          .groupBy('r.postId')
          .addGroupBy('r.icon')
          .getRawMany<{ postId: string; icon: ReactionIcon; count: string }>(),
        this.reactionRepo.find({
          where: { postId: In(postIds), userId: viewerId },
        }),
        this.commentRepo
          .createQueryBuilder('c')
          .select('c.postId', 'postId')
          .addSelect('COUNT(*)', 'count')
          .where('c.postId IN (:...postIds)', { postIds })
          .groupBy('c.postId')
          .getRawMany<{ postId: string; count: string }>(),
      ]);

    const authorMap = new Map(authors.map((a) => [a.id, a]));
    const myReactionMap = new Map(myReactions.map((r) => [r.postId, r.icon]));
    const commentCountMap = new Map(
      commentCountRows.map((r) => [r.postId, Number(r.count)]),
    );

    const reactionCountsByPost = new Map<
      string,
      Record<ReactionIcon, number>
    >();
    for (const postId of postIds) {
      reactionCountsByPost.set(postId, {
        flame: 0,
        flash: 0,
        rocket: 0,
        thumbs_up: 0,
      });
    }
    for (const row of reactionRows) {
      const counts = reactionCountsByPost.get(row.postId);
      if (counts) {
        counts[row.icon] = Number(row.count);
      }
    }

    return posts.map((post) => {
      const author = authorMap.get(post.authorId);
      const reactions: ReactionSummary = {
        counts: reactionCountsByPost.get(post.id) ?? {
          flame: 0,
          flash: 0,
          rocket: 0,
          thumbs_up: 0,
        },
        myReaction: myReactionMap.get(post.id) ?? null,
      };

      return {
        id: post.id,
        authorId: post.authorId,
        authorDisplayName: author?.displayName ?? '',
        authorAvatarIcon: author?.avatarIcon ?? 'person-circle',
        authorAvatarColor: author?.avatarColor ?? '#22d3ee',
        type: post.type,
        body: post.body,
        codeSnippet: post.codeSnippet,
        exerciseId: post.exerciseId,
        exerciseTitle: post.exerciseTitle,
        achievementSlug: post.achievementSlug,
        level: post.level,
        createdAt: post.createdAt.toISOString(),
        reactions,
        commentCount: commentCountMap.get(post.id) ?? 0,
      };
    });
  }

  private toCommentDto(
    comment: PostComment,
    author: User | null | undefined,
  ): CommentDto {
    return {
      id: comment.id,
      postId: comment.postId,
      authorId: comment.authorId,
      authorDisplayName: author?.displayName ?? '',
      authorAvatarIcon: author?.avatarIcon ?? 'person-circle',
      authorAvatarColor: author?.avatarColor ?? '#22d3ee',
      body: comment.body,
      createdAt: comment.createdAt.toISOString(),
    };
  }
}
