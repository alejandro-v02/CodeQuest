export type ProgrammingLanguageSlug = 'python' | 'javascript' | 'typescript' | 'cpp';

export interface LanguageOption {
  slug: ProgrammingLanguageSlug;
  label: string;
  // Languages whose learning path still has no written lessons are shown
  // as "coming soon" and can't be picked.
  available: boolean;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { slug: 'python', label: 'Python', available: true },
  { slug: 'javascript', label: 'JavaScript', available: true },
  { slug: 'typescript', label: 'TypeScript', available: false },
  { slug: 'cpp', label: 'C++', available: false },
];

export const DAILY_GOAL_OPTIONS: number[] = [5, 15, 30, 60];

export interface User {
  id: string;
  email: string;
  displayName: string;
  preferredLanguage: ProgrammingLanguageSlug | null;
  dailyGoalMinutes: number | null;
  timezone: string;
  username: string | null;
  bio: string | null;
  avatarIcon: string;
  avatarColor: string;
  pinnedAchievementSlug: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: User;
}
