import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type {
  ExerciseDetail,
  ExerciseSummary,
  RunResult,
  SubmitOutcome,
} from '../models/exercise.model';

// Only the field matching the exercise's own type is sent — see
// SubmitAnswerDto on the backend for the mirrored shape.
export interface SubmitAnswerBody {
  code?: string;
  selectedIndex?: number;
  answers?: string[];
  order?: string[];
  lineIndex?: number;
}

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

  getNext(conceptId: string): Promise<ExerciseDetail> {
    return firstValueFrom(
      this.http.get<ExerciseDetail>(`${environment.apiUrl}/exercises/next`, {
        params: { conceptId },
      }),
    );
  }

  run(exerciseId: string, code: string): Promise<RunResult> {
    return firstValueFrom(
      this.http.post<RunResult>(`${environment.apiUrl}/exercises/${exerciseId}/run`, { code }),
    );
  }

  submit(exerciseId: string, body: SubmitAnswerBody): Promise<SubmitOutcome> {
    return firstValueFrom(
      this.http.post<SubmitOutcome>(`${environment.apiUrl}/exercises/${exerciseId}/submit`, body),
    );
  }
}
