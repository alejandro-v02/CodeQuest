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

// Fase 5A.4 admin panel — one row per language/concept, counting Fase
// 5A-generated (concept-scoped) exercises by status. Lesson-scoped (Fase 3/4)
// exercises have no concept/status model, so they're excluded entirely.
export interface AdminExerciseStat {
  languageSlug: ProgrammingLanguageSlug;
  languageName: string;
  conceptSlug: string;
  conceptName: string;
  approved: number;
  rejected: number;
  retired: number;
  total: number;
}

// Fase 5B "conceptos débiles" (+ Fase 7 "fuertes") — per-user pass rate for
// each concept they've attempted in a language, used by Práctica libre to
// sort/flag weak ones and by the Progreso stats summary for both ends.
export interface ConceptStat {
  conceptId: string;
  conceptName: string;
  passRate: number | null;
  isWeak: boolean;
  isStrong: boolean;
}

export interface ConceptStatSummary {
  conceptName: string;
  passRate: number | null;
}

// Fase 7 "panel de progreso" — exercisesSolved/accuracy/activeDays are
// global per user (not per language, see ExercisesService.getStatsSummary);
// strongConcepts/weakConcepts stay per-language since they're backed by
// getConceptStats.
export interface StatsSummary {
  exercisesSolved: number;
  accuracy: number | null;
  activeDays: number;
  strongConcepts: ConceptStatSummary[];
  weakConcepts: ConceptStatSummary[];
}
