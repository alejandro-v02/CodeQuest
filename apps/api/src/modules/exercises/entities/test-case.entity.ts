import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exercise } from './exercise.entity';

@Entity('test_cases')
export class TestCase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Exercise, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exercise_id' })
  exercise: Exercise;

  @Column({ name: 'exercise_id' })
  exerciseId: string;

  @Column({ type: 'int' })
  order: number;

  @Column({ type: 'text', default: '' })
  input: string;

  @Column({ type: 'text' })
  expectedOutput: string;

  // Hidden cases run on submit but never expose their input/expected output
  // to the client, so the exercise can't be solved by reading network traffic.
  @Column({ default: false })
  isHidden: boolean;
}
