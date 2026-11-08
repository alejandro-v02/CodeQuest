import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

// Covers every exercise type with one shape; only the field matching the
// exercise's own type is required (checked in ExercisesService, since which
// field applies depends on a DB row, not something class-validator can see).
export class SubmitAnswerDto {
  @IsOptional()
  @IsString()
  @MaxLength(20_000)
  code?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  selectedIndex?: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  answers?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  order?: string[];

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(200)
  lineIndex?: number;
}
