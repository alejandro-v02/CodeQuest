import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import type { AuthResult } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { PublicUser } from '../users/users.mapper';

// Auth endpoints are a brute-force target, so they get a tighter throttle
// than the app-wide default configured in AppModule.
const AUTH_THROTTLE = { default: { limit: 5, ttl: 60_000 } };

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle(AUTH_THROTTLE)
  @Post('register')
  register(@Body() dto: RegisterDto): Promise<AuthResult> {
    return this.authService.register(dto);
  }

  @Throttle(AUTH_THROTTLE)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: LoginDto): Promise<AuthResult> {
    return this.authService.login(dto);
  }

  @Throttle(AUTH_THROTTLE)
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refresh(@CurrentUser() user: PublicUser): AuthResult {
    return this.authService.refreshTokens(user);
  }
}
