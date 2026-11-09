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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
