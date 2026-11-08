import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

// Shape the AI must return for a 'code' exercise, validated before anything
// gets near Piston or the database — never trust a model's "strict JSON"
// claim without checking it.
export class GeneratedTestCaseDto {
  @IsString()
  @MaxLength(2_000)
  input: string;

  @IsString()
  @MaxLength(2_000)
  expectedOutput: string;

  @IsBoolean()
  isHidden: boolean;
}

export class GeneratedExerciseDto {
  @IsString()
  @MinLength(10)
  @MaxLength(2_000)
  prompt: string;

  @IsString()
  @MaxLength(5_000)
  starterCode: string;

  @IsString()
  @MaxLength(5_000)
  referenceSolution: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(6)
  @ValidateNested({ each: true })
  @Type(() => GeneratedTestCaseDto)
  testCases: GeneratedTestCaseDto[];
}
