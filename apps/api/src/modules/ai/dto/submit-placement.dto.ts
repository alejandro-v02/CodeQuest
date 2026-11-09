import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';
import type { ProgrammingLanguageSlug } from '../../users/entities/user.entity';

const LANGUAGE_SLUGS: ProgrammingLanguageSlug[] = [
  'python',
  'javascript',
  'typescript',
  'cpp',
];

export class PlacementAnswerDto {
  @IsInt()
  @Min(0)
  questionIndex: number;

  @IsInt()
  @Min(0)
  selectedIndex: number;
}

export class SubmitPlacementDto {
  @IsIn(LANGUAGE_SLUGS)
  languageSlug: ProgrammingLanguageSlug;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => PlacementAnswerDto)
  answers: PlacementAnswerDto[];
}
