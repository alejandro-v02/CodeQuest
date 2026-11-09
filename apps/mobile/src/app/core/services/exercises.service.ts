import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type {
  ConceptStat,
  ExerciseDetail,
  ExerciseReportReason,
  ExerciseSummary,
  RunResult,
  StatsSummary,
  SubmitOutcome,
} from '../models/exercise.model';
import type { ProgrammingLanguageSlug } from '../models/user.model';

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

  reportExercise(exerciseId: string, reason: ExerciseReportReason): Promise<void> {
    return firstValueFrom(
      this.http.post<void>(`${environment.apiUrl}/exercises/${exerciseId}/report`, { reason }),
    );
  }

  getConceptStats(languageSlug: ProgrammingLanguageSlug): Promise<ConceptStat[]> {
    return firstValueFrom(
      this.http.get<ConceptStat[]>(`${environment.apiUrl}/exercises/concept-stats`, {
        params: { languageSlug },
      }),
    );
  }

  getStatsSummary(languageSlug: ProgrammingLanguageSlug): Promise<StatsSummary> {
    return firstValueFrom(
      this.http.get<StatsSummary>(`${environment.apiUrl}/exercises/stats-summary`, {
        params: { languageSlug },
      }),
    );
  }
}
