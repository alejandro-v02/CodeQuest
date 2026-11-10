import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type ProgrammingLanguageSlug =
  'python' | 'javascript' | 'typescript' | 'cpp';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  // Null for accounts created via GitHub login only.
  @Column({ type: 'varchar', nullable: true })
  passwordHash: string | null;

  // Null for accounts created via email/password only.
  @Column({ type: 'varchar', nullable: true, unique: true })
  githubId: string | null;

  @Column()
  displayName: string;

  // Null until onboarding (Fase 2) is completed.
  @Column({ type: 'varchar', nullable: true })
  preferredLanguage: ProgrammingLanguageSlug | null;

  @Column({ type: 'int', nullable: true })
  dailyGoalMinutes: number | null;

  // Set once by the Fase 5B placement test (POST /ai/placement/submit).
  // Null until taken (or if skipped) — NextExerciseService falls back to its
  // own DEFAULT_DIFFICULTY in that case.
  @Column({ type: 'int', nullable: true })
  placementDifficulty: number | null;

  @Column({ default: 'UTC' })
  timezone: string;

  // Denormalized running total kept in sync with GamificationService's
  // XpEvent inserts — XpEvent stays the source of truth for weekly ranking.
  @Column({ type: 'int', default: 0 })
  xp: number;

  // Social module profile fields — no file-upload infra exists in this
  // project, so the "avatar" is an icon+color pair instead of a photo.
  @Column({ type: 'varchar', length: 160, nullable: true })
  bio: string | null;

  @Column({ type: 'varchar', default: 'person-circle' })
  avatarIcon: string;

  @Column({ type: 'varchar', default: '#22d3ee' })
  avatarColor: string;

  // References ACHIEVEMENTS_CATALOG's slug; validated against the user's own
  // unlocked UserAchievement rows in UsersService, not at the column level.
  @Column({ type: 'varchar', nullable: true })
  pinnedAchievementSlug: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
