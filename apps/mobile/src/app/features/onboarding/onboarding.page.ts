import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonButton, IonSpinner } from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';
import {
  DAILY_GOAL_OPTIONS,
  LANGUAGE_OPTIONS,
  type ProgrammingLanguageSlug,
} from '../../core/models/user.model';
import { I18nService } from '../../core/services/i18n.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
  imports: [IonContent, IonButton, IonSpinner, TranslatePipe],
})
export class OnboardingPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly i18n = inject(I18nService);

  readonly languages = LANGUAGE_OPTIONS;
  readonly dailyGoals = DAILY_GOAL_OPTIONS;

  readonly selectedLanguage = signal<ProgrammingLanguageSlug | null>(null);
  readonly selectedGoal = signal<number | null>(null);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  selectLanguage(slug: ProgrammingLanguageSlug): void {
    this.selectedLanguage.set(slug);
  }

  selectGoal(minutes: number): void {
    this.selectedGoal.set(minutes);
  }

  async finish(): Promise<void> {
    const language = this.selectedLanguage();
    const goal = this.selectedGoal();
    if (!language || !goal || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    try {
      await this.authService.updatePreferences(language, goal);
      await this.router.navigateByUrl('/onboarding/placement');
    } catch {
      this.errorMessage.set(this.i18n.t('onboarding.errors.saveFailed'));
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
