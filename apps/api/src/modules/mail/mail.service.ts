import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, type Transporter } from 'nodemailer';
import type { AppConfig } from '../../config/configuration';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter | null = null;

  constructor(private readonly configService: ConfigService<AppConfig, true>) {}

  async sendInstructorCode(
    to: string,
    code: string,
    minutesValid: number,
  ): Promise<void> {
    const mail = this.configService.get('mail', { infer: true });

    if (!mail.host) {
      // Handy for local development without an SMTP account; never in
      // production, where silently "sending" nothing would lock people out.
      if (
        this.configService.get('nodeEnv', { infer: true }) === 'development'
      ) {
        this.logger.warn(
          `[DEV] SMTP not configured. Sign-in code for ${to}: ${code}`,
        );
        return;
      }
      throw new ServiceUnavailableException(
        'El envío de correos no está configurado.',
      );
    }

    this.transporter ??= createTransport({
      host: mail.host,
      port: mail.port,
      secure: mail.port === 465,
      auth: mail.user ? { user: mail.user, pass: mail.pass } : undefined,
    });

    try {
      await this.transporter.sendMail({
        from: mail.from,
        to,
        subject: 'Tu código para entrar a CodeQuest',
        text:
          `Tu código de verificación de CodeQuest es: ${code}\n\n` +
          `Vence en ${minutesValid} minutos. Si no lo pediste, ignora este correo.`,
        html:
          `<p>Tu código de verificación de CodeQuest es:</p>` +
          `<p style="font-size:28px;font-weight:700;letter-spacing:6px">${code}</p>` +
          `<p>Vence en ${minutesValid} minutos. Si no lo pediste, ignora este correo.</p>`,
      });
    } catch (error) {
      this.logger.error(
        `Could not send the sign-in code to ${to}: ${String(error)}`,
      );
      throw new ServiceUnavailableException(
        'No se pudo enviar el correo. Inténtalo de nuevo en unos minutos.',
      );
    }
  }
}
