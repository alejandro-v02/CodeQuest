import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { GamificationSummary, RankingResponse } from '../models/gamification.model';

@Injectable({ providedIn: 'root' })
export class GamificationService {
  private readonly http = inject(HttpClient);

  getSummary(): Promise<GamificationSummary> {
    return firstValueFrom(
      this.http.get<GamificationSummary>(`${environment.apiUrl}/gamification/me`),
    );
  }

  getRanking(): Promise<RankingResponse> {
    return firstValueFrom(
      this.http.get<RankingResponse>(`${environment.apiUrl}/gamification/ranking`),
    );
  }
}
