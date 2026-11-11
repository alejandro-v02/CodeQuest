import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import type { ClientEventName, EventProps, TrackedEvent } from '../models/analytics.model';

const FLUSH_DELAY_MS = 15_000;
// Matches the server's per-request cap.
const BATCH_SIZE = 20;
const MAX_QUEUE = 100;
const UUID_PATTERN = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;

// "/lesson/3f2a…" -> "/lesson/:id": screens are grouped by route, and ids never
// leave the device.
export function normalizeScreen(url: string): string {
  return url.split(/[?#]/)[0].replace(UUID_PATTERN, ':id');
}

// Batches usage events and sends them to our own API (no third-party SDK).
// Tracking must never get in the user's way: every failure is swallowed and
// events are only kept while the user is logged in.
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  private queue: TrackedEvent[] = [];
  private timer: ReturnType<typeof setTimeout> | null = null;
  private isSending = false;

  constructor() {
    // Hiding the app is the last reliable chance to send what's queued.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        void this.flush();
      }
    });
  }

  track(name: ClientEventName, props?: EventProps): void {
    if (!this.authService.isAuthenticated()) {
      return;
    }

    this.queue.push(props ? { name, props } : { name });
    if (this.queue.length > MAX_QUEUE) {
      this.queue.shift();
    }

    if (this.queue.length >= BATCH_SIZE) {
      void this.flush();
    } else {
      this.scheduleFlush();
    }
  }

  async flush(): Promise<void> {
    this.clearTimer();
    if (this.isSending || this.queue.length === 0) {
      return;
    }

    this.isSending = true;
    const batch = this.queue.splice(0, BATCH_SIZE);
    try {
      await firstValueFrom(
        this.http.post<void>(`${environment.apiUrl}/analytics/events`, { events: batch }),
      );
    } catch (error) {
      // A rejected batch (4xx other than auth/rate-limit) would fail forever,
      // so only transient failures are put back for a later retry.
      if (this.isRetryable(error)) {
        this.queue = [...batch, ...this.queue].slice(-MAX_QUEUE);
        this.scheduleFlush();
      }
    } finally {
      this.isSending = false;
    }

    if (this.queue.length >= BATCH_SIZE) {
      void this.flush();
    }
  }

  private isRetryable(error: unknown): boolean {
    if (!(error instanceof HttpErrorResponse)) {
      return true;
    }
    return error.status === 0 || error.status >= 500 || error.status === 401 || error.status === 429;
  }

  private scheduleFlush(): void {
    this.timer ??= setTimeout(() => {
      this.timer = null;
      void this.flush();
    }, FLUSH_DELAY_MS);
  }

  private clearTimer(): void {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
