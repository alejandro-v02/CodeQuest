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
  level: 'beginner' | 'intermediate' | 'advanced';
  languageSlug: string;
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
  languageSlug: string;
}
