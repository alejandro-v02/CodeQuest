import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
} from '@ionic/angular';
import { ExercisesService } from '../../core/services/exercises.service';
import { CodeEditorComponent } from '../../shared/components/code-editor/code-editor.component';
import { LoadingWaveComponent } from '../../shared/components/loading-wave/loading-wave.component';
import { LoadingBounceComponent } from '../../shared/components/loading-bounce/loading-bounce.component';
import type { ExerciseDetail, RunResult, SubmitResult } from '../../core/models/exercise.model';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.page.html',
  styleUrls: ['./exercise.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    CodeEditorComponent,
    LoadingWaveComponent,
    LoadingBounceComponent,
  ],
})
export class ExercisePage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly exercisesService = inject(ExercisesService);

  readonly exercise = signal<ExerciseDetail | null>(null);
  readonly code = signal('');
  readonly isLoading = signal(true);
  readonly isRunning = signal(false);
  readonly isSubmitting = signal(false);
  readonly result = signal<RunResult | SubmitResult | null>(null);
  readonly errorMessage = signal<string | null>(null);

  constructor() {
    void this.load();
  }

  async load(): Promise<void> {
    const exerciseId = this.route.snapshot.paramMap.get('id');
    if (!exerciseId) {
      await this.router.navigateByUrl('/tabs/home');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const exercise = await this.exercisesService.getExercise(exerciseId);
      this.exercise.set(exercise);
      this.code.set(exercise.starterCode ?? '');
    } catch {
      this.errorMessage.set('No se pudo cargar el ejercicio.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async run(): Promise<void> {
    const exercise = this.exercise();
    if (!exercise || this.isRunning() || this.isSubmitting()) {
      return;
    }

    this.isRunning.set(true);
    this.errorMessage.set(null);
    this.result.set(null);

    try {
      this.result.set(await this.exercisesService.run(exercise.id, this.code()));
    } catch {
      this.errorMessage.set('No se pudo ejecutar el código.');
    } finally {
      this.isRunning.set(false);
    }
  }

  async submit(): Promise<void> {
    const exercise = this.exercise();
    if (!exercise || this.isRunning() || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.result.set(null);

    try {
      const submitResult = await this.exercisesService.submit(exercise.id, this.code());
      this.result.set(submitResult);
      if (submitResult.allPassed) {
        this.exercise.set({ ...exercise, solved: true });
      }
    } catch {
      this.errorMessage.set('No se pudo enviar la solución.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  goBack(): void {
    const lessonId = this.exercise()?.lessonId;
    void this.router.navigateByUrl(lessonId ? `/lesson/${lessonId}` : '/tabs/home');
  }
}
