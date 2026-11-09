import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { LessonDetail, PathOverview } from '../models/course.model';
import { AuthService } from './auth.service';

const CACHE_PREFIX = 'codequest.cache.';

@Injectable({ providedIn: 'root' })
export class CoursesService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  // Set by the most recent getPath/getLesson call when it fell back to
  // cached content because the live request failed — pages read this right
  // after awaiting the call to show a non-blocking "sin conexión" notice
  // instead of the hard error state.
  readonly isOffline = signal(false);

  async getPath(languageSlug: string): Promise<PathOverview> {
    const cacheKey = this.cacheKey('path', languageSlug);
    try {
      const path = await firstValueFrom(
        this.http.get<PathOverview>(`${environment.apiUrl}/courses/${languageSlug}/path`),
      );
      this.isOffline.set(false);
      await Preferences.set({ key: cacheKey, value: JSON.stringify(path) });
      return path;
    } catch (error) {
      const cached = await this.readCache<PathOverview>(cacheKey);
      if (cached) {
        this.isOffline.set(true);
        return cached;
      }
      throw error;
    }
  }

  async getLesson(lessonId: string): Promise<LessonDetail> {
    const cacheKey = this.cacheKey('lesson', lessonId);
    try {
      const lesson = await firstValueFrom(
        this.http.get<LessonDetail>(`${environment.apiUrl}/courses/lessons/${lessonId}`),
      );
      this.isOffline.set(false);
      await Preferences.set({ key: cacheKey, value: JSON.stringify(lesson) });
      return lesson;
    } catch (error) {
      const cached = await this.readCache<LessonDetail>(cacheKey);
      if (cached) {
        this.isOffline.set(true);
        return cached;
      }
      throw error;
    }
  }

  completeLesson(lessonId: string): Promise<LessonDetail> {
    return firstValueFrom(
      this.http.post<LessonDetail>(`${environment.apiUrl}/courses/lessons/${lessonId}/complete`, {}),
    );
  }

  private cacheKey(kind: string, id: string): string {
    const userId = this.authService.currentUser()?.id ?? 'anon';
    return `${CACHE_PREFIX}${userId}.${kind}.${id}`;
  }

  private async readCache<T>(key: string): Promise<T | null> {
    const { value } = await Preferences.get({ key });
    return value ? (JSON.parse(value) as T) : null;
  }
}
