import { IsString, MaxLength, MinLength } from 'class-validator';

export class JoinGroupDto {
  @IsString()
  @MinLength(4)
  @MaxLength(8)
  code: string;
}
