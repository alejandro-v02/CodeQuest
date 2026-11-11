import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { ProgrammingLanguageSlug } from '../../users/entities/user.entity';

export interface PlacementQuestionData {
  prompt: string;
  options: string[];
  correctIndex: number;
}

// Generated once per language and reused for every user: the questions
// (and their answer keys) don't depend on who's taking the quiz, so
// scoring afterwards is local/deterministic instead of another AI call.
@Entity('placement_quizzes')
export class PlacementQuiz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'language_slug', unique: true })
  languageSlug: ProgrammingLanguageSlug;

  @Column({ type: 'jsonb' })
  questions: PlacementQuestionData[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
