import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonButton } from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';
import type { ProgrammingLanguageSlug } from '../../core/models/user.model';

interface LanguageOption {
  slug: ProgrammingLanguageSlug;
  label: string;
}

const LANGUAGES: LanguageOption[] = [
  { slug: 'python', label: 'Python' },
  { slug: 'javascript', label: 'JavaScript' },
  { slug: 'typescript', label: 'TypeScript' },
  { slug: 'cpp', label: 'C++' },
];

const DAILY_GOALS = [5, 15, 30, 60];

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
  imports: [IonContent, IonButton],
})
export class OnboardingPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly languages = LANGUAGES;
  readonly dailyGoals = DAILY_GOALS;

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
      await this.authService.completeOnboarding(language, goal);
      await this.router.navigateByUrl('/tabs/home');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
