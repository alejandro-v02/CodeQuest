export type ClientEventName =
  | 'app_open'
  | 'screen_view'
  | 'language_changed'
  | 'league_opened'
  | 'group_created'
  | 'group_joined'
  | 'practice_started';

export type EventProps = Record<string, string | number | boolean>;

export interface TrackedEvent {
  name: ClientEventName;
  props?: EventProps;
}

export interface Retention {
  day: number;
  eligible: number;
  returned: number;
  rate: number | null;
}

export interface ActivityWindows {
  last24h: number;
  last7d: number;
  last30d: number;
}

// Admin-only product metrics, as served by GET /analytics/summary.
export interface AnalyticsSummary {
  generatedAt: string;
  users: { total: number; newLast7Days: number };
  funnel: { registered: number; onboarded: number; firstExercise: number };
  learners: ActivityWindows;
  appOpens: ActivityWindows;
  retention: Retention[];
  lessonsCompletedByWeek: { weekStart: string; count: number }[];
  ai: {
    usersLast7Days: number;
    limitHitsLast7Days: number;
    usersHitLimitLast7Days: number;
  };
}
