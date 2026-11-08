import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Language } from '../../courses/entities/language.entity';

// A concept is the unit the Fase 5A exercise engine generates and serves
// against (e.g. "Condicionales" in Python) — finer-grained than a Lesson,
// since one lesson can cover several concepts worth of practice.
@Entity('concepts')
@Index(['languageId', 'slug'], { unique: true })
export class Concept {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Language, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'language_id' })
  language: Language;

  @Column({ name: 'language_id' })
  languageId: string;

  @Column({ type: 'varchar' })
  slug: string;

  @Column()
  name: string;

  @Column({ type: 'int' })
  order: number;
}
