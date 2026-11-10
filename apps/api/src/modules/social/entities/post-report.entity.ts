import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type SocialReportTargetType = 'post' | 'comment';
export type SocialReportReason = 'spam' | 'offensive' | 'harassment' | 'other';
export type SocialReportStatus = 'pending' | 'reviewed' | 'dismissed';

// Mirrors ExerciseReport: plain bookkeeping, no admin review UI in v1 —
// reports are just stored, same as that precedent.
@Entity('post_reports')
export class PostReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  reporterId: string;

  @Column({ type: 'varchar' })
  targetType: SocialReportTargetType;

  @Column({ type: 'uuid' })
  targetId: string;

  @Column({ type: 'varchar' })
  reason: SocialReportReason;

  @Column({ type: 'text', nullable: true })
  details: string | null;

  @Column({ type: 'varchar', default: 'pending' })
  status: SocialReportStatus;

  @CreateDateColumn()
  createdAt: Date;
}
