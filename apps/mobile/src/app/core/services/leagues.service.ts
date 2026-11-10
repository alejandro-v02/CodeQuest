import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { League } from '../models/league.model';

@Injectable({ providedIn: 'root' })
export class LeaguesService {
  private readonly http = inject(HttpClient);

  getMine(): Promise<League> {
    return firstValueFrom(this.http.get<League>(`${environment.apiUrl}/leagues/me`));
  }
}
