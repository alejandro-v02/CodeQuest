import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from '../mail/mail.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { InstructorAuthController } from './instructor/instructor-auth.controller';
import { InstructorAuthService } from './instructor/instructor-auth.service';
import { InstructorCode } from './instructor/instructor-code.entity';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { GithubStrategy } from './strategies/github.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([InstructorCode]),
    UsersModule,
    MailModule,
  ],
  controllers: [AuthController, InstructorAuthController],
  providers: [
    AuthService,
    InstructorAuthService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    GithubStrategy,
  ],
})
export class AuthModule {}
