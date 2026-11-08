import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonInput, IonButton, IonIcon, ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';
import { StatusBarService } from '../../core/services/status-bar.service';
import { LoadingWaveComponent } from '../../shared/components/loading-wave/loading-wave.component';
import { DeveloperCreditComponent } from '../../shared/components/developer-credit/developer-credit.component';

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
    LoadingWaveComponent,
    DeveloperCreditComponent,
  ],
})
export class LoginPage implements ViewWillEnter, ViewWillLeave {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly statusBarService = inject(StatusBarService);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  // Lets the top-fade gradient (auth.shared.scss) show through behind the
  // status bar icons instead of stopping below them; restored on leave so
  // the rest of the app keeps its normal (non-overlay) layout.
  ionViewWillEnter(): void {
    void this.statusBarService.enableOverlay();
  }

  ionViewWillLeave(): void {
    void this.statusBarService.disableOverlay();
  }

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
      this.errorMessage.set('Correo o contraseña incorrectos.');
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
