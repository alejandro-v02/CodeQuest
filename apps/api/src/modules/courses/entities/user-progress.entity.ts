import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

// A row's mere existence means the lesson is completed; there's no separate
// "locked/available" status to persist, since that's derived at read time
// from lesson order (see CoursesService).
@Entity('user_progress')
@Unique(['userId', 'lessonId'])
export class UserProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'lesson_id' })
  lessonId: string;

  @CreateDateColumn({ name: 'completed_at' })
  completedAt: Date;
}
