import type { ProgrammingLanguageSlug } from './user.model';

export type ExerciseType = 'code' | 'quiz' | 'fill' | 'sort' | 'bug';

export interface VisibleTestCase {
  id: string;
  order: number;
  input: string;
  expectedOutput: string;
}

// Answer-stripped payloads, as served by GET /exercises/:id — see
// apps/api .../exercises.service.ts#sanitizePayload for what's hidden.
export interface QuizPayload {
  code: string;
  options: string[];
}

export interface FillPayload {
  template: string;
  blankCount: number;
}

export interface SortPayload {
  blocks: string[];
}

export interface BugPayload {
  lines: string[];
}

export type ExercisePayload = QuizPayload | FillPayload | SortPayload | BugPayload;

export interface ExerciseSummary {
  id: string;
  order: number;
  type: ExerciseType;
  prompt: string;
  difficulty: number;
  solved: boolean;
}

export interface ExerciseDetail extends ExerciseSummary {
  // Null for Fase 5A practice exercises, which attach to a Concept instead
  // of a curriculum Lesson.
  lessonId: string | null;
  languageSlug: ProgrammingLanguageSlug;
  starterCode: string | null;
  payload: ExercisePayload | null;
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

// Result shape for quiz/fill/sort/bug — graded structurally, no test cases.
export interface AnswerSubmitResult {
  passed: boolean;
  attemptId: string;
  correctAnswer: unknown;
  explanation: string | null;
}

export type SubmitOutcome = SubmitResult | AnswerSubmitResult;

export function isAnswerSubmitResult(
  result: RunResult | SubmitOutcome,
): result is AnswerSubmitResult {
  return !('testCases' in result);
}
