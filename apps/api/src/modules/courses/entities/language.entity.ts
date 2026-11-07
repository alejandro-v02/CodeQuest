import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import type { ProgrammingLanguageSlug } from '../../users/entities/user.entity';

// Judge0's language id, needed from Fase 4 onward to run a user's code
// against the right interpreter/compiler. Nullable until that's wired up.
@Entity('languages')
export class Language {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  slug: ProgrammingLanguageSlug;

  @Column()
  name: string;

  @Column({ type: 'int', nullable: true })
  judge0LanguageId: number | null;
}
