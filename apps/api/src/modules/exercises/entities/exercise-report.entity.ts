import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

// A user flagging an exercise as broken/unclear. Reviewed through the Fase
// 5A.4 admin panel. Bookkeeping entity: plain uuid columns, no relations —
// same convention as Attempt.
export type ExerciseReportReason =
  'wrong_solution' | 'unclear_prompt' | 'duplicate' | 'other';

export type ExerciseReportStatus = 'pending' | 'reviewed' | 'dismissed';

@Entity('exercise_reports')
export class ExerciseReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'exercise_id' })
  exerciseId: string;

  @Column({ type: 'varchar' })
  reason: ExerciseReportReason;

  @Column({ type: 'text', nullable: true })
  details: string | null;

  @Column({ type: 'varchar', default: 'pending' })
  status: ExerciseReportStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
