import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AppConfig } from '../../../config/configuration';
import type { PublicUser } from '../../users/users.mapper';

// There is no admin role in the data model: admins are the emails listed in
// the ADMIN_EMAILS env var. Always used after JwtAccessGuard, which puts the
// user on the request; with no emails configured nobody gets through.
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly configService: ConfigService<AppConfig, true>) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user?: PublicUser }>();
    const email = request.user?.email?.toLowerCase();
    const adminEmails = this.configService.get('adminEmails', {
      infer: true,
    });

    if (!email || !adminEmails.includes(email)) {
      throw new ForbiddenException('Solo administradores.');
    }
    return true;
  }
}
