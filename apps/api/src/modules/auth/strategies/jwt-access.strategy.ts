import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { AppConfig } from '../../../config/configuration';
import { UsersService } from '../../users/users.service';
import { toPublicUser } from '../../users/users.mapper';
import type { PublicUser } from '../../users/users.mapper';
import type { JwtPayload } from '../types/jwt-payload';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    configService: ConfigService<AppConfig, true>,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt', { infer: true }).accessSecret,
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
