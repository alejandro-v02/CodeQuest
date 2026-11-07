export type ProgrammingLanguageSlug = 'python' | 'javascript' | 'typescript' | 'cpp';

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
