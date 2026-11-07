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

  @Column()
  passwordHash: string;

  @Column()
  displayName: string;

  // Null until onboarding (Fase 2) is completed.
  @Column({ type: 'varchar', nullable: true })
  preferredLanguage: ProgrammingLanguageSlug | null;

  @Column({ type: 'int', nullable: true })
  dailyGoalMinutes: number | null;

  @Column({ default: 'UTC' })
  timezone: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
