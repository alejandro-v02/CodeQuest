import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import type { ExerciseReportReason } from '../entities/exercise-report.entity';

const REASONS: ExerciseReportReason[] = [
  'wrong_solution',
  'unclear_prompt',
  'duplicate',
  'other',
];

export class ReportExerciseDto {
  @IsIn(REASONS)
  reason: ExerciseReportReason;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  details?: string;
}
