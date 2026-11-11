import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonButton, IonContent, IonInput, IonSpinner } from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';
import { I18nService } from '../../core/services/i18n.service';
import { DeveloperCreditComponent } from '../../shared/components/developer-credit/developer-credit.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

const CODE_LENGTH = 6;
// Matches the server's resend cooldown.
const RESEND_SECONDS = 60;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Component({
  selector: 'app-instructor-login',
  templateUrl: './instructor-login.page.html',
  styleUrls: ['./auth.shared.scss'],
  imports: [
    RouterLink,
    IonContent,
    IonInput,
    IonButton,
    IonSpinner,
    DeveloperCreditComponent,
    TranslatePipe,
  ],
})
export class InstructorLoginPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly i18n = inject(I18nService);

  readonly step = signal<'email' | 'code'>('email');
  readonly email = signal('');
  readonly code = signal('');
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly resendIn = signal(0);

  readonly canSendCode = computed(() => EMAIL_PATTERN.test(this.email().trim()));
  readonly canVerify = computed(() => this.code().length === CODE_LENGTH);

  private timer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.stopTimer());
  }

  onEmailInput(event: Event): void {
    this.email.set((event.target as HTMLInputElement).value);
    this.errorMessage.set(null);
  }

  onCodeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, CODE_LENGTH);
    // The native field must be rewritten too, or non-digits would stay visible.
    input.value = digits;
    this.code.set(digits);
    this.errorMessage.set(null);
  }

  async sendCode(): Promise<void> {
    if (!this.canSendCode() || this.isSubmitting() || this.resendIn() > 0) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    try {
      await this.authService.requestInstructorCode(this.email().trim());
      this.code.set('');
      this.step.set('code');
      this.startResendCountdown();
    } catch (error) {
      this.errorMessage.set(this.requestErrorMessage(error));
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async verify(): Promise<void> {
    if (!this.canVerify() || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    try {
      await this.authService.verifyInstructorCode(this.email().trim(), this.code());
      await this.router.navigateByUrl('/tabs/home');
    } catch (error) {
      this.errorMessage.set(
        this.i18n.t(
          error instanceof HttpErrorResponse && error.status === 400
            ? 'auth.instructor.errors.invalidCode'
            : error instanceof HttpErrorResponse && error.status === 429
              ? 'auth.instructor.errors.tooManyRequests'
              : 'auth.instructor.errors.verifyFailed',
        ),
      );
    } finally {
      this.isSubmitting.set(false);
    }
  }

  changeEmail(): void {
    this.step.set('email');
    this.code.set('');
    this.errorMessage.set(null);
  }

  codeSubtitle(): string {
    return this.i18n.t('auth.instructor.codeSubtitle').replace('{email}', this.email().trim());
  }

  resendLabel(): string {
    return this.resendIn() > 0
      ? this.i18n.t('auth.instructor.resendIn').replace('{s}', String(this.resendIn()))
      : this.i18n.t('auth.instructor.resend');
  }

  private requestErrorMessage(error: unknown): string {
    const status = error instanceof HttpErrorResponse ? error.status : 0;
    const key =
      status === 400
        ? 'auth.instructor.errors.notInstitutional'
        : status === 429
          ? 'auth.instructor.errors.tooManyRequests'
          : status === 503
            ? 'auth.instructor.errors.mailUnavailable'
            : 'auth.instructor.errors.sendFailed';
    return this.i18n.t(key);
  }

  private startResendCountdown(): void {
    this.stopTimer();
    this.resendIn.set(RESEND_SECONDS);
    this.timer = setInterval(() => {
      const next = this.resendIn() - 1;
      this.resendIn.set(Math.max(0, next));
      if (next <= 0) {
        this.stopTimer();
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
