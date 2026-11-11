import { IsEmail, Matches, MaxLength } from 'class-validator';

export class VerifyInstructorCodeDto {
  @IsEmail()
  @MaxLength(254)
  email: string;

  @Matches(/^\d{6}$/, { message: 'code must be 6 digits' })
  code: string;
}
