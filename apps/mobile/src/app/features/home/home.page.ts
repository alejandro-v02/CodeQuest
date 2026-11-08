import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon } from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';
import { CoursesService } from '../../core/services/courses.service';
import type { LessonSummary, PathOverview } from '../../core/models/course.model';
import { LoadingBounceComponent } from '../../shared/components/loading-bounce/loading-bounce.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, LoadingBounceComponent],
})
export class HomePage {
  private readonly authService = inject(AuthService);
  private readonly coursesService = inject(CoursesService);
  private readonly router = inject(Router);

  readonly path = signal<PathOverview | null>(null);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  constructor() {
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
