import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('streaks')
export class Streak {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'user_id', unique: true })
  userId: string;

  @Column({ type: 'int', default: 0, name: 'current_streak' })
  currentStreak: number;

  @Column({ type: 'int', default: 0, name: 'longest_streak' })
  longestStreak: number;

  // 'YYYY-MM-DD' in the user's own timezone — a calendar day has no single
  // instant across timezones, so this isn't stored as a Date/timestamp.
  @Column({ type: 'varchar', nullable: true, name: 'last_activity_date' })
  lastActivityDate: string | null;

  // Consecutive exercises passed for the first time with no hint used on
  // any of them — resets to 0 the moment a hint is used on one. Backs the
  // "10 ejercicios sin pistas" achievement.
  @Column({ type: 'int', default: 0, name: 'no_hint_streak' })
  noHintStreak: number;
}
