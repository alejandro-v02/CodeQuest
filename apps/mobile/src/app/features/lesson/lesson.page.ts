import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonIcon, IonButton, IonContent, IonSpinner, ViewWillEnter } from '@ionic/angular';
import { CoursesService } from '../../core/services/courses.service';
import { ExercisesService } from '../../core/services/exercises.service';
import { MarkdownService } from '../../core/services/markdown.service';
import type { LessonDetail } from '../../core/models/course.model';
import type { ExerciseSummary } from '../../core/models/exercise.model';
import { LoadingBounceComponent } from '../../shared/components/loading-bounce/loading-bounce.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.page.html',
  styleUrls: ['./lesson.page.scss'],
  imports: [IonIcon, IonButton, IonContent, IonSpinner, LoadingBounceComponent, PageHeaderComponent],
})
export class LessonPage implements ViewWillEnter {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly coursesService = inject(CoursesService);
  private readonly exercisesService = inject(ExercisesService);
  private readonly markdownService = inject(MarkdownService);

  readonly lesson = signal<LessonDetail | null>(null);
  readonly exercises = signal<ExerciseSummary[]>([]);
  readonly isLoading = signal(true);
  readonly isCompleting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly renderedContent = computed(() => {
    const content = this.lesson()?.contentMarkdown;
    return content ? this.markdownService.render(content) : null;
  });

  // Same IonicRouteStrategy caching issue as HomePage: two different
  // accounts can reach the exact same lesson id (shared curriculum), which
  // would reuse this page's stale lock/solved state without this hook.
  ionViewWillEnter(): void {
    void this.load();
  }

  async load(): Promise<void> {
    const lessonId = this.route.snapshot.paramMap.get('id');
    if (!lessonId) {
      await this.router.navigateByUrl('/tabs/home');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      this.lesson.set(await this.coursesService.getLesson(lessonId));
      this.exercises.set(await this.exercisesService.getForLesson(lessonId));
    } catch {
      this.errorMessage.set('No se pudo cargar la lección.');
    } finally {
      this.isLoading.set(false);
    }
  }

  openExercise(exerciseId: string): void {
    void this.router.navigateByUrl(`/exercise/${exerciseId}`);
  }

  exerciseIcon(type: ExerciseSummary['type']): string {
    switch (type) {
      case 'quiz':
        return 'help-circle-outline';
      case 'fill':
        return 'create-outline';
      case 'sort':
        return 'swap-vertical';
      case 'bug':
        return 'bug-outline';
      default:
        return 'code-slash';
    }
  }

  async complete(): Promise<void> {
    const current = this.lesson();
    if (!current || this.isCompleting()) {
      return;
    }

    this.isCompleting.set(true);
    try {
      this.lesson.set(await this.coursesService.completeLesson(current.id));
    } catch {
      this.errorMessage.set('No se pudo marcar la lección como completada.');
    } finally {
      this.isCompleting.set(false);
    }
  }

  goBack(): void {
    void this.router.navigateByUrl('/tabs/home');
  }
}
