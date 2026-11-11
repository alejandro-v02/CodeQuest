import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { AdminExerciseStat } from '../models/admin.model';
import type { AnalyticsSummary } from '../models/analytics.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);

  getStats(): Promise<AdminExerciseStat[]> {
    return firstValueFrom(
      this.http.get<AdminExerciseStat[]>(`${environment.apiUrl}/exercises/admin/stats`),
    );
  }

  getAnalyticsSummary(): Promise<AnalyticsSummary> {
    return firstValueFrom(
      this.http.get<AnalyticsSummary>(`${environment.apiUrl}/analytics/summary`),
    );
  }
}
