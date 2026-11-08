import type { ExerciseType } from './entities/exercise.entity';
import type { ProgrammingLanguageSlug } from '../users/entities/user.entity';

export interface VisibleTestCase {
  id: string;
  order: number;
  input: string;
  expectedOutput: string;
}

// Client-facing, answer-stripped versions of Exercise['payload'] — never
// include correctIndex/blanks/buggyLineIndex/explanation before the user
// submits (see ExercisesService.sanitizePayload).
export interface QuizPayloadView {
  code: string;
  options: string[];
}

export interface FillPayloadView {
  template: string;
  blankCount: number;
}

export interface SortPayloadView {
  // Pre-shuffled server-side; the client only reorders and submits back the
  // block texts, so this array carries no information about the answer.
  blocks: string[];
}

export interface BugPayloadView {
  lines: string[];
}

export type ExercisePayloadView =
  QuizPayloadView | FillPayloadView | SortPayloadView | BugPayloadView;

export interface ExerciseSummary {
  id: string;
  order: number;
  type: ExerciseType;
  prompt: string;
  difficulty: number;
  solved: boolean;
}

export interface ExerciseDetail extends ExerciseSummary {
  // Null for Fase 5A-generated practice exercises, which attach to a Concept
  // instead of a curriculum Lesson.
  lessonId: string | null;
  languageSlug: ProgrammingLanguageSlug;
  starterCode: string | null;
  payload: ExercisePayloadView | null;
  testCases: VisibleTestCase[];
}

export interface TestCaseResult {
  id: string;
  passed: boolean;
  // Omitted for hidden test cases: the client never learns their input,
  // expected output, or actual output, only whether it passed.
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

// Result shape for the Fase 4B types (quiz/fill/sort/bug) — graded
// structurally against the stored payload, no sandbox/test-case run.
export interface AnswerSubmitResult {
  passed: boolean;
  attemptId: string;
  correctAnswer: unknown;
  explanation: string | null;
}
