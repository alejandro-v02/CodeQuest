import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonButton, IonIcon, IonModal, IonSpinner, ViewWillEnter } from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';
import { CoursesService } from '../../core/services/courses.service';
import type { LessonSummary, PathOverview } from '../../core/models/course.model';
import {
  DAILY_GOAL_OPTIONS,
  LANGUAGE_OPTIONS,
  type ProgrammingLanguageSlug,
} from '../../core/models/user.model';
import { LoadingBounceComponent } from '../../shared/components/loading-bounce/loading-bounce.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { LanguageBadgeComponent } from '../../shared/components/language-badge/language-badge.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    IonContent,
    IonButton,
    IonIcon,
    IonModal,
    IonSpinner,
    LoadingBounceComponent,
    PageHeaderComponent,
    LanguageBadgeComponent,
  ],
})
export class HomePage implements ViewWillEnter {
  private readonly authService = inject(AuthService);
  private readonly coursesService = inject(CoursesService);
  private readonly router = inject(Router);

  readonly path = signal<PathOverview | null>(null);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  readonly languages = LANGUAGE_OPTIONS;
  readonly dailyGoals = DAILY_GOAL_OPTIONS;
  readonly isSettingsOpen = signal(false);
  readonly selectedLanguage = signal<ProgrammingLanguageSlug | null>(null);
  readonly selectedGoal = signal<number | null>(null);
  readonly isSavingPreferences = signal(false);

  // Ionic's IonicRouteStrategy (app.config.ts) caches and reuses this page's
  // component instance instead of recreating it, so the constructor only
  // ever runs once per app session — a second login/account would keep
  // showing the first account's path. ionViewWillEnter fires on every
  // activation regardless, so the path is reloaded for whoever is logged in.
  ionViewWillEnter(): void {
    void this.loadPath();
  }

  async loadPath(): Promise<void> {
    const language = this.authService.currentUser()?.preferredLanguage;
    if (!language) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      this.path.set(await this.coursesService.getPath(language));
    } catch {
      this.errorMessage.set('No se pudo cargar tu ruta de aprendizaje.');
    } finally {
      this.isLoading.set(false);
    }
  }

  openLesson(lesson: LessonSummary): void {
    if (lesson.status === 'locked') {
      return;
    }
    void this.router.navigateByUrl(`/lesson/${lesson.id}`);
  }

  openPractice(): void {
    void this.router.navigateByUrl('/practice');
  }

  currentLanguage(): ProgrammingLanguageSlug | null {
    return this.authService.currentUser()?.preferredLanguage ?? null;
  }

  currentGoal(): number | null {
    return this.authService.currentUser()?.dailyGoalMinutes ?? null;
  }

  hasPreferenceChanges(): boolean {
    return this.selectedLanguage() !== this.currentLanguage() || this.selectedGoal() !== this.currentGoal();
  }

  openSettings(): void {
    this.selectedLanguage.set(this.currentLanguage());
    this.selectedGoal.set(this.currentGoal());
    this.isSettingsOpen.set(true);
  }

  closeSettings(): void {
    this.isSettingsOpen.set(false);
  }

  async savePreferences(): Promise<void> {
    const language = this.selectedLanguage();
    const goal = this.selectedGoal();
    if (!language || !goal || !this.hasPreferenceChanges() || this.isSavingPreferences()) {
      return;
    }

    this.isSavingPreferences.set(true);
    try {
      const languageChanged = language !== this.currentLanguage();
      await this.authService.updatePreferences(language, goal);
      this.isSettingsOpen.set(false);
      if (languageChanged) {
        await this.loadPath();
      }
    } finally {
      this.isSavingPreferences.set(false);
    }
  }

  async logout(): Promise<void> {
    this.isSettingsOpen.set(false);
    await this.authService.logout();
    await this.router.navigateByUrl('/auth/login');
  }

  statusIcon(status: LessonSummary['status']): string {
    switch (status) {
      case 'completed':
        return 'checkmark-circle';
      case 'locked':
        return 'lock-closed';
      default:
        return 'ellipse-outline';
    }
  }

  completedLessons(overview: PathOverview): number {
    return overview.modules
      .flatMap((module) => module.lessons)
      .filter((lesson) => lesson.status === 'completed').length;
  }

  totalLessons(overview: PathOverview): number {
    return overview.modules.flatMap((module) => module.lessons).length;
  }

  progressPercent(overview: PathOverview): number {
    const total = this.totalLessons(overview);
    return total === 0 ? 0 : Math.round((this.completedLessons(overview) / total) * 100);
  }

  progressMessage(overview: PathOverview): string {
    const percent = this.progressPercent(overview);
    if (percent === 0) {
      return 'Empieza tu primera lección.';
    }
    if (percent === 100) {
      return '¡Completaste toda la ruta!';
    }
    if (percent >= 50) {
      return '¡Vas por buen camino!';
    }
    return '¡Sigue así!';
  }
}
