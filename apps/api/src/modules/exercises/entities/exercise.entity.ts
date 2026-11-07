import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lesson } from '../../courses/entities/lesson.entity';

// Only 'code' is implemented in Fase 4; quiz/fill/sort/etc. land in Fase 4B
// (see PLAN.md) and will reuse this same row with a different `type`.
export type ExerciseType = 'code';

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

  @Column({ type: 'int', default: 1 })
  difficulty: number;

  @Column({ default: false })
  isAiGenerated: boolean;
}
