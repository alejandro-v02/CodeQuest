import type { ProgrammingLanguageSlug } from './user.model';

// One row per language/concept — counts of Fase 5A-generated exercises by
// status, as served by GET /exercises/admin/stats.
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
