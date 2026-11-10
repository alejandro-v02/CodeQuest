export type ProgrammingLanguageSlug = 'python' | 'javascript' | 'typescript' | 'cpp';

export interface LanguageOption {
  slug: ProgrammingLanguageSlug;
  label: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { slug: 'python', label: 'Python' },
  { slug: 'javascript', label: 'JavaScript' },
  { slug: 'typescript', label: 'TypeScript' },
  { slug: 'cpp', label: 'C++' },
];

export const DAILY_GOAL_OPTIONS: number[] = [5, 15, 30, 60];

export interface User {
  id: string;
  email: string;
  displayName: string;
  preferredLanguage: ProgrammingLanguageSlug | null;
  dailyGoalMinutes: number | null;
  timezone: string;
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
