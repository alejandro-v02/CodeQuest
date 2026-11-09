import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

// Shape the AI must return for the placement quiz, validated before it's
// cached or shown to anyone — never trust a model's "strict JSON" claim
// unchecked. correctIndex is kept server-side only (see PlacementQuiz).
export class GeneratedPlacementQuestionItemDto {
  @IsString()
  @MinLength(5)
  @MaxLength(500)
  prompt: string;

  @IsArray()
  @ArrayMinSize(4)
  @ArrayMaxSize(4)
  @IsString({ each: true })
  options: string[];

  @IsInt()
  @Min(0)
  @Max(3)
  correctIndex: number;
}

export class GeneratedPlacementQuestionsDto {
  @IsArray()
  @ArrayMinSize(3)
  @ArrayMaxSize(6)
  @ValidateNested({ each: true })
  @Type(() => GeneratedPlacementQuestionItemDto)
  questions: GeneratedPlacementQuestionItemDto[];
}
