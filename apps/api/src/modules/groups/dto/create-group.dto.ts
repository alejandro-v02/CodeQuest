import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @MinLength(3)
  @MaxLength(60)
  name: string;
}
