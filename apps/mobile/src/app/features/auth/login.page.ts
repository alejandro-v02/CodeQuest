import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonInput, IonButton, IonIcon, IonSpinner } from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';
import { DeveloperCreditComponent } from '../../shared/components/developer-credit/developer-credit.component';
import { I18nService } from '../../core/services/i18n.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./auth.shared.scss'],
  imports: [
    ReactiveFormsModule,
    RouterLink,
    IonContent,
    IonInput,
    IonButton,
    IonIcon,
    IonSpinner,
    DeveloperCreditComponent,
    TranslatePipe,
  ],
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly i18n = inject(I18nService);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  async submit(): Promise<void> {
    if (this.form.invalid || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    try {
      await this.authService.login(this.form.getRawValue());
      await this.router.navigateByUrl('/tabs/home');
    } catch {
      this.errorMessage.set(this.i18n.t('auth.login.errors.invalidCredentials'));
    } finally {
      this.isSubmitting.set(false);
    }
  }

  // Opens the system browser; DeepLinkService picks up the session once
  // GitHub redirects back to the app, so there's nothing to await here.
  async continueWithGithub(): Promise<void> {
    await this.authService.loginWithGithub();
  }
}
