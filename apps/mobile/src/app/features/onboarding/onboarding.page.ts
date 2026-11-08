import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonButton } from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';
import {
  DAILY_GOAL_OPTIONS,
  LANGUAGE_OPTIONS,
  type ProgrammingLanguageSlug,
} from '../../core/models/user.model';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
  imports: [IonContent, IonButton],
})
export class OnboardingPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly languages = LANGUAGE_OPTIONS;
  readonly dailyGoals = DAILY_GOAL_OPTIONS;

  readonly selectedLanguage = signal<ProgrammingLanguageSlug | null>(null);
  readonly selectedGoal = signal<number | null>(null);
  readonly isSubmitting = signal(false);

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
    try {
      await this.authService.updatePreferences(language, goal);
      await this.router.navigateByUrl('/tabs/home');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
