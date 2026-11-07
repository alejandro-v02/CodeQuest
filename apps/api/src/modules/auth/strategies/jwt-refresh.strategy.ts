import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import type { Request } from 'express';
import type { AppConfig } from '../../../config/configuration';
import { UsersService } from '../../users/users.service';
import { toPublicUser } from '../../users/users.mapper';
import type { PublicUser } from '../../users/users.mapper';
import type { JwtPayload } from '../types/jwt-payload';

function extractRefreshTokenFromBody(request: Request): string | null {
  const body = request.body as { refreshToken?: unknown } | undefined;
  return typeof body?.refreshToken === 'string' ? body.refreshToken : null;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    configService: ConfigService<AppConfig, true>,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: extractRefreshTokenFromBody,
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt', { infer: true }).refreshSecret,
    });
  }

  async validate(payload: JwtPayload): Promise<PublicUser> {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }
    return toPublicUser(user);
  }
}
