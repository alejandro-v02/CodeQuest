import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import type { ProgrammingLanguageSlug } from '../../users/entities/user.entity';

@Entity('languages')
export class Language {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  slug: ProgrammingLanguageSlug;

  @Column()
  name: string;
}
