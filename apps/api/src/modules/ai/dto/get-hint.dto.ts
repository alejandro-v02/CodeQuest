import { IsIn } from 'class-validator';
import type { ProgrammingLanguageSlug } from '../../users/entities/user.entity';

const LEVELS = [1, 2, 3];
const LANGUAGE_SLUGS: ProgrammingLanguageSlug[] = [
  'python',
  'javascript',
  'typescript',
  'cpp',
];

export class GetHintDto {
  @IsIn(LEVELS)
  level: 1 | 2 | 3;

  // Sent by the client (already loaded on the exercise page) instead of
  // re-resolved server-side, which would otherwise need to join through
  // either the exercise's Lesson or its Concept depending on origin.
  @IsIn(LANGUAGE_SLUGS)
  languageSlug: ProgrammingLanguageSlug;
}
