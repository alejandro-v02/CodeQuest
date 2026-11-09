import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type {
  ExplainErrorResponse,
  HintResponse,
  PlacementAnswer,
  PlacementQuestion,
  PlacementSubmitResult,
} from '../models/ai.model';
import type { ProgrammingLanguageSlug } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AiService {
  private readonly http = inject(HttpClient);

  getHint(
    exerciseId: string,
    level: 1 | 2 | 3,
    languageSlug: ProgrammingLanguageSlug,
  ): Promise<HintResponse> {
    return firstValueFrom(
      this.http.post<HintResponse>(`${environment.apiUrl}/ai/exercises/${exerciseId}/hint`, {
        level,
        languageSlug,
      }),
    );
  }

  explainError(
    exerciseId: string,
    languageSlug: ProgrammingLanguageSlug,
    code: string,
    errorMessage: string,
  ): Promise<ExplainErrorResponse> {
    return firstValueFrom(
      this.http.post<ExplainErrorResponse>(
        `${environment.apiUrl}/ai/exercises/${exerciseId}/explain-error`,
        { languageSlug, code, errorMessage },
      ),
    );
  }

  getPlacementQuestions(languageSlug: ProgrammingLanguageSlug): Promise<PlacementQuestion[]> {
    return firstValueFrom(
      this.http.get<PlacementQuestion[]>(`${environment.apiUrl}/ai/placement/questions`, {
        params: { languageSlug },
      }),
    );
  }

  submitPlacement(
    languageSlug: ProgrammingLanguageSlug,
    answers: PlacementAnswer[],
  ): Promise<PlacementSubmitResult> {
    return firstValueFrom(
      this.http.post<PlacementSubmitResult>(`${environment.apiUrl}/ai/placement/submit`, {
        languageSlug,
        answers,
      }),
    );
  }
}
