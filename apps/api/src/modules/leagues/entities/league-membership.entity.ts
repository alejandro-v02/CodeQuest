import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

// A user's place in one week's bracket. The week's result (promoted, demoted
// or stayed) is never stored: it is derived from that bracket's final
// standings when the next week's membership is created.
@Entity('league_memberships')
@Index(['userId', 'weekStart'], { unique: true })
export class LeagueMembership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  @Index()
  groupId: string;

  @Column({ type: 'varchar', length: 10 })
  weekStart: string;

  @Column({ type: 'int' })
  tier: number;

  @CreateDateColumn()
  createdAt: Date;
}
