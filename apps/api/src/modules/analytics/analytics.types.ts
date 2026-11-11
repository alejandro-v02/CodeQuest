export interface RetentionDto {
  day: number;
  // Users whose day N has fully passed, and how many of them learned
  // something (earned XP) exactly on that day.
  eligible: number;
  returned: number;
  rate: number | null;
}

// Distinct active users in rolling windows ending now.
export interface ActivityWindowsDto {
  last24h: number;
  last7d: number;
  last30d: number;
}

export interface AnalyticsSummaryDto {
  generatedAt: string;
  users: { total: number; newLast7Days: number };
  funnel: {
    registered: number;
    onboarded: number;
    firstExercise: number;
  };
  // Activity measured by XP earned (a real learning action).
  learners: ActivityWindowsDto;
  // Activity measured by the app_open event (only exists since tracking began).
  appOpens: ActivityWindowsDto;
  retention: RetentionDto[];
  lessonsCompletedByWeek: { weekStart: string; count: number }[];
  ai: {
    usersLast7Days: number;
    limitHitsLast7Days: number;
    usersHitLimitLast7Days: number;
  };
}
