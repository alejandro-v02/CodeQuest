import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user_achievements')
@Index(['userId', 'achievementSlug'], { unique: true })
export class UserAchievement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar', name: 'achievement_slug' })
  achievementSlug: string;

  @CreateDateColumn({ name: 'unlocked_at' })
  unlockedAt: Date;
}
