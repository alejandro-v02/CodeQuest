import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { ConceptSummary } from '../models/concept.model';

@Injectable({ providedIn: 'root' })
export class ConceptsService {
  private readonly http = inject(HttpClient);

  listForLanguage(languageSlug: string): Promise<ConceptSummary[]> {
    return firstValueFrom(
      this.http.get<ConceptSummary[]>(`${environment.apiUrl}/concepts`, {
        params: { languageSlug },
      }),
    );
  }
}
