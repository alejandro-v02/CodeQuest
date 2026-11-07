import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type {
  ExerciseDetail,
  ExerciseSummary,
  RunResult,
  SubmitResult,
} from '../models/exercise.model';

@Injectable({ providedIn: 'root' })
export class ExercisesService {
  private readonly http = inject(HttpClient);

  getForLesson(lessonId: string): Promise<ExerciseSummary[]> {
    return firstValueFrom(
      this.http.get<ExerciseSummary[]>(`${environment.apiUrl}/exercises/lesson/${lessonId}`),
    );
  }

  getExercise(exerciseId: string): Promise<ExerciseDetail> {
    return firstValueFrom(
      this.http.get<ExerciseDetail>(`${environment.apiUrl}/exercises/${exerciseId}`),
    );
  }

  run(exerciseId: string, code: string): Promise<RunResult> {
    return firstValueFrom(
      this.http.post<RunResult>(`${environment.apiUrl}/exercises/${exerciseId}/run`, { code }),
    );
  }

  submit(exerciseId: string, code: string): Promise<SubmitResult> {
    return firstValueFrom(
      this.http.post<SubmitResult>(`${environment.apiUrl}/exercises/${exerciseId}/submit`, { code }),
    );
  }
}
