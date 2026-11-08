import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

// One row per exercise served to a user, so the Fase 5A "next exercise"
// service can exclude already-seen exercises. Bookkeeping entity: plain
// uuid columns, no relations — same convention as Attempt.
export type UserExerciseOutcome = 'served' | 'passed' | 'failed';

@Entity('user_exercise_history')
@Index(['userId', 'exerciseId'])
export class UserExerciseHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'exercise_id' })
  exerciseId: string;

  @Column({ type: 'varchar', name: 'concept_id', nullable: true })
  conceptId: string | null;

  @Column({ type: 'varchar', default: 'served' })
  outcome: UserExerciseOutcome;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
