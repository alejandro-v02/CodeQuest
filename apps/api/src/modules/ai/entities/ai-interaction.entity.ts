import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

// Audit/usage log for every AI-backed feature (hints, error explanations,
// placement test) — read by AiUsageService to enforce the per-user daily
// cap and kept for visibility into Gemini free-tier consumption.
export type AiInteractionKind = 'hint' | 'explain_error' | 'placement';

@Entity('ai_interactions')
export class AiInteraction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Null for system-level generations not billed to a specific user (e.g.
  // the first request that fills a language's placement-quiz cache).
  @Column({ type: 'varchar', name: 'user_id', nullable: true })
  userId: string | null;

  // Only set for exercise-scoped interactions (hint, explain_error) — lets
  // GamificationService check "did this user use a hint on this exercise".
  @Column({ type: 'varchar', name: 'exercise_id', nullable: true })
  exerciseId: string | null;

  @Column({ type: 'varchar' })
  kind: AiInteractionKind;

  // true when served from cache (ExerciseHint/PlacementQuiz) instead of
  // calling Gemini — excluded from the daily limit count.
  @Column({ default: false })
  cached: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
