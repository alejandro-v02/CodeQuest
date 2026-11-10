export type GroupRole = 'owner' | 'member';

export interface GroupSummaryDto {
  id: string;
  name: string;
  role: GroupRole;
  memberCount: number;
  weeklyXp: number;
  // Only the owner gets the join code.
  code: string | null;
}

export interface GroupMemberDto {
  userId: string;
  displayName: string;
  username: string | null;
  avatarIcon: string;
  avatarColor: string;
  level: number;
  totalXp: number;
  weeklyXp: number;
  currentStreak: number;
  // 'YYYY-MM-DD' in the member's own timezone, or null if never active.
  lastActivityDate: string | null;
  rank: number;
  isOwner: boolean;
  isMe: boolean;
  // Only ever true for the group owner's view: a member who joined a while
  // ago and has had no activity for a week.
  isStalled: boolean;
}

export interface GroupDetailDto extends GroupSummaryDto {
  activeThisWeek: number;
  members: GroupMemberDto[];
}

export interface GroupRankingEntryDto {
  groupId: string;
  name: string;
  memberCount: number;
  averageWeeklyXp: number;
  rank: number;
  isMine: boolean;
}

export interface GroupRankingResponse {
  top: GroupRankingEntryDto[];
  // The user's best-ranked group, even when outside the top list.
  mine: GroupRankingEntryDto | null;
}
