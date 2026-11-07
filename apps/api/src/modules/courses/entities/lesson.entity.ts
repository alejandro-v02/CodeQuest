import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CourseModule } from './course-module.entity';

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CourseModule, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'module_id' })
  module: CourseModule;

  @Column({ name: 'module_id' })
  moduleId: string;

  @Column({ type: 'int' })
  order: number;

  @Column()
  title: string;

  // Null for languages whose curriculum map is seeded but whose lessons
  // haven't been written yet (TypeScript/C++ in Fase 3 — see PLAN.md).
  @Column({ type: 'text', nullable: true })
  contentMarkdown: string | null;

  @Column({ type: 'int', default: 10 })
  xpReward: number;
}
