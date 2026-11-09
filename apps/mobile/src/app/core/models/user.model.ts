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

export interface LanguageBrand {
  monogram: string;
  colorFrom: string;
  colorTo: string;
  textColor: string;
}

// Used by the home path card and its language badge — one accent per
// language instead of the single app-wide secondary color, so each path
// feels distinct.
export const LANGUAGE_BRANDS: Record<ProgrammingLanguageSlug, LanguageBrand> = {
  python: { monogram: 'Py', colorFrom: '#4B8BBE', colorTo: '#FFE873', textColor: '#0a0a0a' },
  javascript: { monogram: 'JS', colorFrom: '#F7DF1E', colorTo: '#F0C808', textColor: '#1a1a1a' },
  typescript: { monogram: 'TS', colorFrom: '#3178C6', colorTo: '#275A9C', textColor: '#ffffff' },
  cpp: { monogram: 'C++', colorFrom: '#00599C', colorTo: '#004482', textColor: '#ffffff' },
};

export interface User {
  id: string;
  email: string;
  displayName: string;
  preferredLanguage: ProgrammingLanguageSlug | null;
  dailyGoalMinutes: number | null;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: User;
}
