import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { AdminExerciseStat } from '../models/admin.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);

  getStats(): Promise<AdminExerciseStat[]> {
    return firstValueFrom(
      this.http.get<AdminExerciseStat[]>(`${environment.apiUrl}/exercises/admin/stats`),
    );
  }
}
