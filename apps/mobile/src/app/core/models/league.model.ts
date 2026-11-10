export type LeagueZone = 'promote' | 'demote' | 'safe';
export type LeagueResult = 'promoted' | 'demoted' | 'stayed';

export interface LeagueMember {
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

export interface LeagueLastWeek {
  result: LeagueResult;
  fromTier: number;
  toTier: number;
  rank: number;
  size: number;
}

export interface League {
  tier: number;
  maxTier: number;
  weekStart: string;
  weekEnd: string;
  zoneSize: number;
  members: LeagueMember[];
  lastWeek: LeagueLastWeek | null;
}
