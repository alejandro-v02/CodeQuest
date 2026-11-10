import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonButton, ViewWillEnter } from '@ionic/angular';
import { AiService } from '../../core/services/ai.service';
import { AuthService } from '../../core/services/auth.service';
import { LoadingBounceComponent } from '../../shared/components/loading-bounce/loading-bounce.component';
import type { PlacementAnswer, PlacementQuestion } from '../../core/models/ai.model';
import { I18nService } from '../../core/services/i18n.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-placement',
  templateUrl: './placement.page.html',
  styleUrls: ['./placement.page.scss'],
  imports: [IonContent, IonButton, LoadingBounceComponent, TranslatePipe],
})
export class PlacementPage implements ViewWillEnter {
  private readonly aiService = inject(AiService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly i18n = inject(I18nService);

  readonly questions = signal<PlacementQuestion[]>([]);
  readonly currentIndex = signal(0);
  readonly answers = signal<PlacementAnswer[]>([]);
  readonly isLoading = signal(true);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  // Same IonicRouteStrategy caching note as the rest of the app's pages —
  // this page is only ever entered right after /onboarding, but resets its
  // own state on every activation just in case.
  ionViewWillEnter(): void {
    void this.load();
  }

  async load(): Promise<void> {
    const language = this.authService.currentUser()?.preferredLanguage;
    if (!language) {
      await this.router.navigateByUrl('/tabs/home');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.currentIndex.set(0);
    this.answers.set([]);

    try {
      this.questions.set(await this.aiService.getPlacementQuestions(language));
    } catch {
      this.errorMessage.set(this.i18n.t('placement.errors.loadFailed'));
    } finally {
      this.isLoading.set(false);
    }
  }

  async selectAnswer(selectedIndex: number): Promise<void> {
    if (this.isSubmitting()) {
      return;
    }

    const questionIndex = this.currentIndex();
    this.answers.update((answers) => [...answers, { questionIndex, selectedIndex }]);

    if (questionIndex + 1 < this.questions().length) {
      this.currentIndex.set(questionIndex + 1);
      return;
    }

    await this.finish();
  }

  async skip(): Promise<void> {
    await this.router.navigateByUrl('/tabs/home');
  }

  private async finish(): Promise<void> {
    const language = this.authService.currentUser()?.preferredLanguage;
    if (!language) {
      await this.router.navigateByUrl('/tabs/home');
      return;
    }

    this.isSubmitting.set(true);
    try {
      await this.aiService.submitPlacement(language, this.answers());
    } catch {
      // Falling back to the default difficulty is a fine outcome here — the
      // test is a nice-to-have, not something worth blocking onboarding on.
    } finally {
      await this.router.navigateByUrl('/tabs/home');
    }
  }
}
