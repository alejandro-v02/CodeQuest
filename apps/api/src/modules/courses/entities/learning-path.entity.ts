import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Language } from './language.entity';

export type PathLevel = 'beginner' | 'intermediate' | 'advanced';

// One per language+level (e.g. "Python, nivel principiante"). Fase 3 only
// seeds the beginner path for each language.
@Entity('learning_paths')
export class LearningPath {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Language, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'language_id' })
  language: Language;

  @Column({ name: 'language_id' })
  languageId: string;

  @Column({ type: 'varchar' })
  level: PathLevel;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;
}
