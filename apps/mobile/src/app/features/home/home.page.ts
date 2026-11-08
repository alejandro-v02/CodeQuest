import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonButton, IonIcon, IonModal, IonSpinner, ViewWillEnter } from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';
import { CoursesService } from '../../core/services/courses.service';
import type { LessonSummary, PathOverview } from '../../core/models/course.model';
import { LANGUAGE_OPTIONS, type ProgrammingLanguageSlug } from '../../core/models/user.model';
import { LoadingBounceComponent } from '../../shared/components/loading-bounce/loading-bounce.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

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
  readonly isSettingsOpen = signal(false);
  readonly selectedLanguage = signal<ProgrammingLanguageSlug | null>(null);
  readonly isSavingLanguage = signal(false);

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

  openSettings(): void {
    this.selectedLanguage.set(this.currentLanguage());
    this.isSettingsOpen.set(true);
  }

  closeSettings(): void {
    this.isSettingsOpen.set(false);
  }

  async saveLanguage(): Promise<void> {
    const language = this.selectedLanguage();
    const dailyGoalMinutes = this.authService.currentUser()?.dailyGoalMinutes;
    if (!language || !dailyGoalMinutes || language === this.currentLanguage() || this.isSavingLanguage()) {
      return;
    }

    this.isSavingLanguage.set(true);
    try {
      await this.authService.updatePreferences(language, dailyGoalMinutes);
      this.isSettingsOpen.set(false);
      await this.loadPath();
    } finally {
      this.isSavingLanguage.set(false);
    }
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
}
