import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import type { AppConfig } from '../../../config/configuration';
import { MailService } from '../../mail/mail.service';
import { UsersService } from '../../users/users.service';
import { AuthService, type AuthResult } from '../auth.service';
import { InstructorCode } from './instructor-code.entity';
import {
  CODE_TTL_MS,
  MAX_ATTEMPTS,
  RESEND_COOLDOWN_MS,
  displayNameFromEmail,
  generateCode,
  hashCode,
  hashesMatch,
  isInstructorEmail,
  normalizeEmail,
} from './instructor-code.rules';

const INVALID_CODE_MESSAGE = 'Código inválido o vencido.';

// Passwordless sign-in for instructors: proving they can read an institutional
// mailbox is what marks the account as an instructor (and lets them create
// groups). No password is ever created for these accounts.
@Injectable()
export class InstructorAuthService {
  constructor(
    @InjectRepository(InstructorCode)
    private readonly codeRepo: Repository<InstructorCode>,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService<AppConfig, true>,
  ) {}

  async requestCode(rawEmail: string): Promise<void> {
    const email = normalizeEmail(rawEmail);
    const domains = this.configService.get('instructorEmailDomains', {
      infer: true,
    });
    if (!isInstructorEmail(email, domains)) {
      throw new BadRequestException(
        'Usa tu correo institucional para ingresar como instructor.',
      );
    }

    const latest = await this.codeRepo.findOne({
      where: { email },
      order: { createdAt: 'DESC' },
    });
    if (
      latest &&
      Date.now() - latest.createdAt.getTime() < RESEND_COOLDOWN_MS
    ) {
      throw new HttpException(
        'Espera un momento antes de pedir otro código.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const code = generateCode();
    const record = await this.codeRepo.save(
      this.codeRepo.create({
        email,
        codeHash: hashCode(email, code, this.secret()),
        expiresAt: new Date(Date.now() + CODE_TTL_MS),
      }),
    );

    try {
      await this.mailService.sendInstructorCode(
        email,
        code,
        CODE_TTL_MS / 60_000,
      );
    } catch (error) {
      // A code that never reached the inbox shouldn't start the resend cooldown.
      await this.codeRepo.delete({ id: record.id });
      throw error;
    }
  }

  async verifyCode(rawEmail: string, code: string): Promise<AuthResult> {
    const email = normalizeEmail(rawEmail);

    const record = await this.codeRepo.findOne({
      where: { email, consumedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
    if (
      !record ||
      record.expiresAt.getTime() < Date.now() ||
      record.attempts >= MAX_ATTEMPTS
    ) {
      throw new BadRequestException(INVALID_CODE_MESSAGE);
    }

    if (!hashesMatch(record.codeHash, hashCode(email, code, this.secret()))) {
      await this.codeRepo.increment({ id: record.id }, 'attempts', 1);
      throw new BadRequestException(INVALID_CODE_MESSAGE);
    }

    // Atomic claim: two simultaneous requests with the right code can't both
    // succeed, the second finds the row already consumed.
    const claimed = await this.codeRepo.update(
      { id: record.id, consumedAt: IsNull() },
      { consumedAt: new Date() },
    );
    if (claimed.affected !== 1) {
      throw new BadRequestException(INVALID_CODE_MESSAGE);
    }

    const existing = await this.usersService.findByEmail(email);
    const user =
      existing ??
      (await this.usersService.create({
        email,
        displayName: displayNameFromEmail(email),
      }));
    const instructor = await this.usersService.markInstructor(user.id);
    return this.authService.issueSession(instructor);
  }

  private secret(): string {
    return this.configService.get('jwt', { infer: true }).accessSecret;
  }
}
