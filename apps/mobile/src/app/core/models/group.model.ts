export type GroupRole = 'owner' | 'member';

export interface GroupSummary {
  id: string;
  name: string;
  role: GroupRole;
  memberCount: number;
  weeklyXp: number;
  // Only the owner receives the join code.
  code: string | null;
}

export interface GroupMember {
  userId: string;
  displayName: string;
  username: string | null;
  avatarIcon: string;
  avatarColor: string;
  level: number;
  totalXp: number;
  weeklyXp: number;
  currentStreak: number;
  lastActivityDate: string | null;
  rank: number;
  isOwner: boolean;
  isMe: boolean;
  // Only ever true in the owner's view.
  isStalled: boolean;
}

export interface GroupDetail extends GroupSummary {
  activeThisWeek: number;
  members: GroupMember[];
}

export interface GroupRankingEntry {
  groupId: string;
  name: string;
  memberCount: number;
  averageWeeklyXp: number;
  rank: number;
  isMine: boolean;
}

export interface GroupRanking {
  top: GroupRankingEntry[];
  mine: GroupRankingEntry | null;
}
