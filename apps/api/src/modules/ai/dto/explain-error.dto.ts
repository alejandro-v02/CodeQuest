import { IsIn, IsString, MaxLength, MinLength } from 'class-validator';
import type { ProgrammingLanguageSlug } from '../../users/entities/user.entity';

const LANGUAGE_SLUGS: ProgrammingLanguageSlug[] = [
  'python',
  'javascript',
  'typescript',
  'cpp',
];

export class ExplainErrorDto {
  @IsIn(LANGUAGE_SLUGS)
  languageSlug: ProgrammingLanguageSlug;

  @IsString()
  @MaxLength(5_000)
  code: string;

  @IsString()
  @MinLength(1)
  @MaxLength(2_000)
  errorMessage: string;
}
