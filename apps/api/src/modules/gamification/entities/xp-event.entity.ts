import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type XpEventReason = 'lesson' | 'exercise';

// Source of truth for XP: User.xp is a denormalized running total kept in
// sync with this table, but weekly ranking and any future "XP this week"
// feature can only be computed by summing these rows over a date range.
@Entity('xp_events')
export class XpEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'user_id' })
  userId: string;

  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'varchar' })
  reason: XpEventReason;

  // exerciseId or lessonId depending on `reason` — used to dedup (an
  // exercise/lesson only ever pays XP once per user), not joined.
  @Column({ type: 'varchar', name: 'source_id' })
  sourceId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
