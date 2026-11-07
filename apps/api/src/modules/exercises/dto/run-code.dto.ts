import { IsString, MaxLength } from 'class-validator';

export class RunCodeDto {
  @IsString()
  @MaxLength(20_000)
  code: string;
}
