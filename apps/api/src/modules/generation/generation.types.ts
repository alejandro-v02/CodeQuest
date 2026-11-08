export type GenerationOutcome =
  | 'approved'
  | 'invalid_shape'
  | 'reference_solution_failed'
  | 'starter_code_already_passes'
  | 'duplicate';

export interface GenerateCodeExerciseResult {
  outcome: GenerationOutcome;
  // Unset only for 'invalid_shape' — there's no well-formed row to persist
  // for debugging in that case (see GenerationService).
  exerciseId?: string;
}
