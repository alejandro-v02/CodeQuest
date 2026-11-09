export interface AchievementStatus {
  slug: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
}

export interface GamificationSummary {
  xp: number;
  level: number;
  streak: {
    current: number;
    longest: number;
  };
  achievements: AchievementStatus[];
}

export interface RankingEntry {
  userId: string;
  displayName: string;
  weeklyXp: number;
  rank: number;
}

export interface RankingResponse {
  top: RankingEntry[];
  me: RankingEntry;
}
