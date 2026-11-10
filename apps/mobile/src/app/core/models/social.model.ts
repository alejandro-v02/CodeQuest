export type PostType = 'text' | 'achievement' | 'level_up' | 'solved_exercise';

export type ReactionIcon = 'flame' | 'flash' | 'rocket' | 'thumbs_up';

export const REACTION_ICONS: ReactionIcon[] = ['flame', 'flash', 'rocket', 'thumbs_up'];

export interface ReactionSummary {
  counts: Record<ReactionIcon, number>;
  myReaction: ReactionIcon | null;
}

export interface PostDto {
  id: string;
  authorId: string;
  authorDisplayName: string;
  authorAvatarIcon: string;
  authorAvatarColor: string;
  type: PostType;
  body: string | null;
  codeSnippet: string | null;
  exerciseId: string | null;
  exerciseTitle: string | null;
  achievementSlug: string | null;
  level: number | null;
  createdAt: string;
  reactions: ReactionSummary;
  commentCount: number;
}

export interface FeedPage {
  items: PostDto[];
  nextCursor: string | null;
}

export interface CommentDto {
  id: string;
  postId: string;
  authorId: string;
  authorDisplayName: string;
  authorAvatarIcon: string;
  authorAvatarColor: string;
  body: string;
  createdAt: string;
}

export interface HeatmapDay {
  date: string;
  count: number;
}

export interface AchievementDefinition {
  slug: string;
  title: string;
  description: string;
  icon: string;
}

export interface ProfileResponse {
  userId: string;
  displayName: string;
  avatarIcon: string;
  avatarColor: string;
  level: number;
  isSelf: boolean;
  isFollowedByMe: boolean;
  followersCount: number;
  followingCount: number;
  unlocked: boolean;
  bio?: string | null;
  pinnedAchievement?: AchievementDefinition | null;
}

export type SocialReportTargetType = 'post' | 'comment';
export type SocialReportReason = 'spam' | 'offensive' | 'harassment' | 'other';
