import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonSpinner } from '@ionic/angular';
import { CoursesService } from '../../core/services/courses.service';
import { MarkdownService } from '../../core/services/markdown.service';
import type { LessonDetail } from '../../core/models/course.model';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.page.html',
  styleUrls: ['./lesson.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonSpinner,
  ],
})
export class LessonPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly coursesService = inject(CoursesService);
  private readonly markdownService = inject(MarkdownService);

  readonly lesson = signal<LessonDetail | null>(null);
  readonly isLoading = signal(true);
  readonly isCompleting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly renderedContent = computed(() => {
    const content = this.lesson()?.contentMarkdown;
    return content ? this.markdownService.render(content) : null;
  });

  constructor() {
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
    } catch {
      this.errorMessage.set('No se pudo cargar la lección.');
    } finally {
      this.isLoading.set(false);
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
