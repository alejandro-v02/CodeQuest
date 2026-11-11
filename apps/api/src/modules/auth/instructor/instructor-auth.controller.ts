import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { AuthResult } from '../auth.service';
import { RequestInstructorCodeDto } from './dto/request-instructor-code.dto';
import { VerifyInstructorCodeDto } from './dto/verify-instructor-code.dto';
import { InstructorAuthService } from './instructor-auth.service';

// Requesting a code sends an email, so it gets the tightest limit.
const REQUEST_THROTTLE = { default: { limit: 3, ttl: 60_000 } };
const VERIFY_THROTTLE = { default: { limit: 10, ttl: 60_000 } };

@Controller('auth/instructor')
export class InstructorAuthController {
  constructor(private readonly instructorAuthService: InstructorAuthService) {}

  @Throttle(REQUEST_THROTTLE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('request-code')
  async requestCode(@Body() dto: RequestInstructorCodeDto): Promise<void> {
    await this.instructorAuthService.requestCode(dto.email);
  }

  @Throttle(VERIFY_THROTTLE)
  @HttpCode(HttpStatus.OK)
  @Post('verify')
  verify(@Body() dto: VerifyInstructorCodeDto): Promise<AuthResult> {
    return this.instructorAuthService.verifyCode(dto.email, dto.code);
  }
}
