import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LearningPath } from './learning-path.entity';

// Named CourseModule (not "Module") to avoid clashing with Nest's own
// @Module decorator/type in imports across the codebase.
@Entity('course_modules')
export class CourseModule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => LearningPath, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'path_id' })
  path: LearningPath;

  @Column({ name: 'path_id' })
  pathId: string;

  @Column({ type: 'int' })
  order: number;

  @Column()
  title: string;
}
