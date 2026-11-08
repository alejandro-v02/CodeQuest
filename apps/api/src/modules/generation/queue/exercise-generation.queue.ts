export const EXERCISE_GENERATION_QUEUE = 'exercise-generation';

export interface ExerciseGenerationJobData {
  conceptId: string;
  difficulty: number;
  // How many approved exercises this job should try to add to the bank —
  // batched per job so the Fase 5A.3 low-watermark check doesn't flood the
  // queue with single-exercise jobs.
  count: number;
}
