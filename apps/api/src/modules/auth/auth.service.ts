import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import type { AppConfig } from '../../config/configuration';
import type { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { toPublicUser } from '../users/users.mapper';
import type { PublicUser } from '../users/users.mapper';
import type { RegisterDto } from './dto/register.dto';
import type { LoginDto } from './dto/login.dto';
import type { JwtPayload } from './types/jwt-payload';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult extends AuthTokens {
  user: PublicUser;
}

export interface GithubProfile {
  githubId: string;
  email: string;
  displayName: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AppConfig, true>,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResult> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = await argon2.hash(dto.password);
    const user = await this.usersService.create({
      email: dto.email,
      passwordHash,
      displayName: dto.displayName,
    });

    return this.buildAuthResult(user.id, user.email, toPublicUser(user));
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user?.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await argon2.verify(
      user.passwordHash,
      dto.password,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.buildAuthResult(user.id, user.email, toPublicUser(user));
  }

  // Called from the GitHub OAuth callback once Passport has already
  // resolved the profile. Finds-or-creates by githubId, linking onto an
  // existing email/password account instead of creating a duplicate when
  // the GitHub email matches one already registered.
  async loginWithGithubProfile(profile: GithubProfile): Promise<AuthResult> {
    const byGithubId = await this.usersService.findByGithubId(profile.githubId);
    if (byGithubId) {
      return this.buildAuthResult(
        byGithubId.id,
        byGithubId.email,
        toPublicUser(byGithubId),
      );
    }

    const byEmail = await this.usersService.findByEmail(profile.email);
    if (byEmail) {
      const linked = await this.usersService.linkGithubId(
        byEmail.id,
        profile.githubId,
      );
      return this.buildAuthResult(
        linked.id,
        linked.email,
        toPublicUser(linked),
      );
    }

    const created = await this.usersService.create({
      email: profile.email,
      displayName: profile.displayName,
      githubId: profile.githubId,
    });
    return this.buildAuthResult(
      created.id,
      created.email,
      toPublicUser(created),
    );
  }

  // For sign-in flows that verify the user themselves (instructor email code).
  issueSession(user: User): AuthResult {
    return this.buildAuthResult(user.id, user.email, toPublicUser(user));
  }

  // The refresh guard already validated the incoming refresh token and
  // resolved the user; this just mints a fresh token pair for them.
  refreshTokens(user: PublicUser): AuthResult {
    return { ...this.buildTokens(user.id, user.email), user };
  }

  private buildAuthResult(
    userId: string,
    email: string,
    user: PublicUser,
  ): AuthResult {
    return { ...this.buildTokens(userId, email), user };
  }

  private buildTokens(userId: string, email: string): AuthTokens {
    const payload: JwtPayload = { sub: userId, email };
    const jwtConfig = this.configService.get('jwt', { infer: true });

    const accessToken = this.jwtService.sign(payload, {
      secret: jwtConfig.accessSecret,
      expiresIn: jwtConfig.accessExpiresIn,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: jwtConfig.refreshSecret,
      expiresIn: jwtConfig.refreshExpiresIn,
    });

    return { accessToken, refreshToken };
  }
}
