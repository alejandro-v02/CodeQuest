import { IsEmail, MaxLength } from 'class-validator';

export class RequestInstructorCodeDto {
  @IsEmail()
  @MaxLength(254)
  email: string;
}
