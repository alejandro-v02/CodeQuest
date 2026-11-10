import {
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import type { PostType } from '../entities/post.entity';

// Only user-composable post types — 'achievement'/'level_up' are only ever
// created server-side by GamificationService.
const COMPOSABLE_TYPES: PostType[] = ['text', 'solved_exercise'];

export class CreatePostDto {
  @IsIn(COMPOSABLE_TYPES)
  type: PostType;

  // Free text for 'text' posts, an optional caption for 'solved_exercise'.
  @ValidateIf((dto: CreatePostDto) => dto.type === 'text')
  @IsString()
  @MaxLength(500)
  body?: string;

  @IsOptional()
  @ValidateIf((dto: CreatePostDto) => dto.type === 'solved_exercise')
  @IsString()
  @MaxLength(500)
  caption?: string;

  @ValidateIf((dto: CreatePostDto) => dto.type === 'solved_exercise')
  @IsUUID()
  exerciseId?: string;

  @ValidateIf((dto: CreatePostDto) => dto.type === 'solved_exercise')
  @IsString()
  @MaxLength(2000)
  codeSnippet?: string;

  // Client-supplied display label (the exercise's prompt, already in hand on
  // the exercise page when sharing) — avoids this module needing to depend
  // on the Exercise entity just to resolve a title for display.
  @ValidateIf((dto: CreatePostDto) => dto.type === 'solved_exercise')
  @IsString()
  @MaxLength(300)
  exerciseTitle?: string;
}
