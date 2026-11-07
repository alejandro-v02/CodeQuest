import type { ProgrammingLanguageSlug } from './user.model';

export type ExerciseType = 'code';

export interface VisibleTestCase {
  id: string;
  order: number;
  input: string;
  expectedOutput: string;
}

export interface ExerciseSummary {
  id: string;
  order: number;
  type: ExerciseType;
  prompt: string;
  difficulty: number;
  solved: boolean;
}

export interface ExerciseDetail extends ExerciseSummary {
  lessonId: string;
  languageSlug: ProgrammingLanguageSlug;
  starterCode: string | null;
  testCases: VisibleTestCase[];
}

export interface TestCaseResult {
  id: string;
  passed: boolean;
  input: string | null;
  expectedOutput: string | null;
  actualOutput: string | null;
  stderr: string | null;
}

export interface RunResult {
  allPassed: boolean;
  testCases: TestCaseResult[];
}

export interface SubmitResult extends RunResult {
  attemptId: string;
}
