import type { ProgrammingLanguageSlug } from '../users/entities/user.entity';
import type { PathLevel } from './entities/learning-path.entity';

export type LessonStatus = 'locked' | 'available' | 'completed';

export interface LessonSummary {
  id: string;
  title: string;
  order: number;
  status: LessonStatus;
}

export interface ModuleSummary {
  id: string;
  title: string;
  order: number;
  status: LessonStatus;
  lessons: LessonSummary[];
}

export interface PathOverview {
  id: string;
  title: string;
  description: string | null;
  level: PathLevel;
  languageSlug: ProgrammingLanguageSlug;
  modules: ModuleSummary[];
}

export interface LessonDetail {
  id: string;
  moduleId: string;
  moduleTitle: string;
  title: string;
  order: number;
  status: LessonStatus;
  contentMarkdown: string | null;
  xpReward: number;
}
