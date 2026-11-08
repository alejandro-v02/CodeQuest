import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

// One row per "Enviar" (submit), not per "Ejecutar" (run) — a quick test run
// against the visible cases only is never persisted.
@Entity('attempts')
export class Attempt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'exercise_id' })
  exerciseId: string;

  // The submitted code for 'code' exercises; for Fase 4B types (quiz/fill/
  // sort/bug) this holds the submitted answer JSON-stringified instead.
  @Column({ type: 'text' })
  code: string;

  @Column()
  passed: boolean;

  @Column({ type: 'text', nullable: true })
  output: string | null;

  @Column({ type: 'text', nullable: true })
  errorMessage: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
