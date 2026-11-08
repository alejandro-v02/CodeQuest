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
