export type LeagueZone = 'promote' | 'demote' | 'safe';
export type LeagueResult = 'promoted' | 'demoted' | 'stayed';

export interface LeagueMemberDto {
  userId: string;
  displayName: string;
  username: string | null;
  avatarIcon: string;
  avatarColor: string;
  weeklyXp: number;
  rank: number;
  isMe: boolean;
  zone: LeagueZone;
}

export interface LeagueLastWeekDto {
  result: LeagueResult;
  fromTier: number;
  toTier: number;
  rank: number;
  size: number;
}

export interface LeagueDto {
  tier: number;
  maxTier: number;
  // ISO timestamps (Monday 00:00 UTC) bounding the current week.
  weekStart: string;
  weekEnd: string;
  // How many places at each end of the table promote / demote.
  zoneSize: number;
  members: LeagueMemberDto[];
  lastWeek: LeagueLastWeekDto | null;
}
