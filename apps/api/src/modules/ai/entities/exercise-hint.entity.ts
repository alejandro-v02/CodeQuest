import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

// A hint only depends on the exercise itself (prompt/difficulty), never on
// who's asking or their current code — generated once per exercise+level
// and reused by every user who requests it.
@Entity('exercise_hints')
@Index(['exerciseId', 'level'], { unique: true })
export class ExerciseHint {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'exercise_id' })
  exerciseId: string;

  @Column({ type: 'int' })
  level: number;

  @Column({ type: 'text' })
  text: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
