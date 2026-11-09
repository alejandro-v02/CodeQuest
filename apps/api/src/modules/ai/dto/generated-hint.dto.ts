import { IsString, MaxLength, MinLength } from 'class-validator';

// Shape the AI must return for a hint, validated before it's cached or
// shown to anyone — never trust a model's "strict JSON" claim unchecked.
export class GeneratedHintDto {
  @IsString()
  @MinLength(5)
  @MaxLength(1_000)
  text: string;
}
