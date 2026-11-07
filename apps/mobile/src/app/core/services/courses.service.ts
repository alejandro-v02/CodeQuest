import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { LessonDetail, PathOverview } from '../models/course.model';

@Injectable({ providedIn: 'root' })
export class CoursesService {
  private readonly http = inject(HttpClient);

  getPath(languageSlug: string): Promise<PathOverview> {
    return firstValueFrom(
      this.http.get<PathOverview>(`${environment.apiUrl}/courses/${languageSlug}/path`),
    );
  }

  getLesson(lessonId: string): Promise<LessonDetail> {
    return firstValueFrom(
      this.http.get<LessonDetail>(`${environment.apiUrl}/courses/lessons/${lessonId}`),
    );
  }

  completeLesson(lessonId: string): Promise<LessonDetail> {
    return firstValueFrom(
      this.http.post<LessonDetail>(`${environment.apiUrl}/courses/lessons/${lessonId}/complete`, {}),
    );
  }
}
