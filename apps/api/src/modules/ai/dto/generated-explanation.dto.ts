import { IsString, MaxLength, MinLength } from 'class-validator';

// Shape the AI must return for an error explanation, validated before it's
// shown to anyone — never trust a model's "strict JSON" claim unchecked.
export class GeneratedExplanationDto {
  @IsString()
  @MinLength(5)
  @MaxLength(1_500)
  explanation: string;
}
