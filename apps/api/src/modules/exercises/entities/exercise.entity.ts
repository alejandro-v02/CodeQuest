import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lesson } from '../../courses/entities/lesson.entity';
import { Concept } from '../../concepts/entities/concept.entity';

// 'code' (Fase 4) runs on Piston against TestCase rows. The Fase 4B types
// below are graded structurally against `payload` instead — no sandbox.
export type ExerciseType = 'code' | 'quiz' | 'fill' | 'sort' | 'bug';

// Fase 3/4 hand-authored exercises are born 'approved'. Fase 5A's generator
// creates rows as 'pending_verification' until the execution+dedup pipeline
// clears them for serving; 'rejected' ones are kept (not deleted) for
// debugging the generator/prompts.
export type ExerciseStatus = 'approved' | 'pending_verification' | 'rejected';

export interface QuizPayload {
  code: string;
  options: string[];
  correctIndex: number;
}

export interface FillPayload {
  // Blanks are written as {{0}}, {{1}}... in order; `blanks[i]` is the
  // accepted answer for placeholder {{i}}.
  template: string;
  blanks: string[];
}

export interface SortPayload {
  // Stored in the correct order; the client shuffles for display and
  // submits back an array of block texts, so no index bookkeeping is
  // needed to grade it (see ExercisesService.submitSort).
  blocks: string[];
}

export interface BugPayload {
  lines: string[];
  buggyLineIndex: number;
  explanation: string;
}

export type ExercisePayload =
  QuizPayload | FillPayload | SortPayload | BugPayload;

@Entity('exercises')
export class Exercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Lesson, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;

  @Column({ name: 'lesson_id' })
  lessonId: string;

  @Column({ type: 'int' })
  order: number;

  @Column({ type: 'varchar', default: 'code' })
  type: ExerciseType;

  @Column({ type: 'text' })
  prompt: string;

  @Column({ type: 'text', nullable: true })
  starterCode: string | null;

  // Type-specific content for the Fase 4B types (null for 'code', which uses
  // starterCode/TestCase instead).
  @Column({ type: 'jsonb', nullable: true })
  payload: ExercisePayload | null;

  @Column({ type: 'int', default: 1 })
  difficulty: number;

  @Column({ default: false })
  isAiGenerated: boolean;

  @Column({ type: 'varchar', default: 'approved' })
  status: ExerciseStatus;

  // Nullable: Fase 3/4 hand-authored exercises predate concepts. Fase 5A's
  // generator sets this to group its output for serving/dedup.
  @ManyToOne(() => Concept, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'concept_id' })
  concept: Concept | null;

  @Column({ type: 'varchar', name: 'concept_id', nullable: true })
  conceptId: string | null;
}
