import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type EventPropValue = string | number | boolean;

// First-party, self-hosted usage log (no third-party SDK, no extra cost):
// small named events with a few flat props, used to measure retention and the
// funnel. Props must never hold personal data (see analytics.rules.ts).
@Entity('analytics_events')
@Index(['name', 'createdAt'])
export class AnalyticsEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  userId: string | null;

  @Column({ type: 'varchar', length: 40 })
  name: string;

  @Column({ type: 'jsonb', nullable: true })
  props: Record<string, EventPropValue> | null;

  @CreateDateColumn()
  @Index()
  createdAt: Date;
}
