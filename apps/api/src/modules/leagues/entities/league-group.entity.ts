import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

// One weekly bracket: up to LEAGUE_GROUP_SIZE people in the same tier who
// compete on that week's XP. A new set is created every week.
@Entity('league_groups')
@Index(['weekStart', 'tier'])
export class LeagueGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 'YYYY-MM-DD' of the Monday (UTC) that starts the week.
  @Column({ type: 'varchar', length: 10 })
  weekStart: string;

  @Column({ type: 'int' })
  tier: number;

  @CreateDateColumn()
  createdAt: Date;
}
