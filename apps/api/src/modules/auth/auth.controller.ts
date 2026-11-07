import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import type { AppConfig } from '../../config/configuration';
import { AuthService } from './auth.service';
import type { AuthResult } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { GithubAuthGuard } from './guards/github.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { PublicUser } from '../users/users.mapper';

// Auth endpoints are a brute-force target, so they get a tighter throttle
// than the app-wide default configured in AppModule.
const AUTH_THROTTLE = { default: { limit: 5, ttl: 60_000 } };

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<AppConfig, true>,
  ) {}

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

  // Entry point the mobile app opens in the system browser. The guard does
  // all the work: with no ?code yet, it redirects to GitHub's consent page.
  @UseGuards(GithubAuthGuard)
  @Get('github')
  githubLogin(): void {}

  // GitHub redirects here with ?code=...; the guard exchanges it, runs
  // GithubStrategy.validate() and attaches the resulting AuthResult as
  // req.user. We hand the tokens to the app via a deep-link redirect
  // instead of JSON, since the browser (not the app) is the HTTP client.
  @UseGuards(GithubAuthGuard)
  @Get('github/callback')
  githubCallback(
    @Req() req: Request & { user: AuthResult },
    @Res() res: Response,
  ): void {
    const { accessToken, refreshToken } = req.user;
    const deepLinkUrl = this.configService.get('mobileDeepLinkUrl', {
      infer: true,
    });

    const params = new URLSearchParams({ accessToken, refreshToken });
    res.redirect(`${deepLinkUrl}?${params.toString()}`);
  }
}
