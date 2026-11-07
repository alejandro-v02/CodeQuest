import { IsIn, IsInt, Max, Min } from 'class-validator';
import type { ProgrammingLanguageSlug } from '../entities/user.entity';

const SUPPORTED_LANGUAGES: ProgrammingLanguageSlug[] = [
  'python',
  'javascript',
  'typescript',
  'cpp',
];

export class UpdateOnboardingDto {
  @IsIn(SUPPORTED_LANGUAGES)
  preferredLanguage: ProgrammingLanguageSlug;

  @IsInt()
  @Min(5)
  @Max(240)
  dailyGoalMinutes: number;
}
