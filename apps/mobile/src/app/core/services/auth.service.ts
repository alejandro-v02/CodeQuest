import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Browser } from '@capacitor/browser';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenStorageService } from './token-storage.service';
import type { AuthResult, User } from '../models/user.model';

export interface RegisterInput {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

// Holds tokens in memory (read by the auth interceptor) and mirrors them to
// disk via TokenStorageService. restoreSession() is run once at app start
// (see app.config.ts) so route guards never see a "loading" auth state.
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorageService);

  private readonly _currentUser = signal<User | null>(null);
  private readonly _accessToken = signal<string | null>(null);
  private _refreshToken: string | null = null;

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);
  readonly needsOnboarding = computed(() => {
    const user = this._currentUser();
    return user !== null && (user.preferredLanguage === null || user.dailyGoalMinutes === null);
  });

  accessToken(): string | null {
    return this._accessToken();
  }

  async restoreSession(): Promise<void> {
    const stored = await this.tokenStorage.read();
    if (!stored) {
      return;
    }

    this.setTokens(stored.accessToken, stored.refreshToken);

    try {
      const user = await firstValueFrom(this.http.get<User>(`${environment.apiUrl}/users/me`));
      this._currentUser.set(user);
    } catch {
      // Access token likely expired; the interceptor only refreshes on 401
      // for requests it mediates, so retry once here explicitly.
      const refreshed = await this.tryRefresh();
      if (!refreshed) {
        await this.clearSession();
      }
    }
  }

  async register(input: RegisterInput): Promise<void> {
    const result = await firstValueFrom(
      this.http.post<AuthResult>(`${environment.apiUrl}/auth/register`, input),
    );
    await this.applyAuthResult(result);
  }

  async login(input: LoginInput): Promise<void> {
    const result = await firstValueFrom(
      this.http.post<AuthResult>(`${environment.apiUrl}/auth/login`, input),
    );
    await this.applyAuthResult(result);
  }

  // Backs both onboarding (first-time setup) and the settings modal (editing
  // preferences afterward) — same endpoint, same shape, just called from
  // two different screens.
  async updatePreferences(preferredLanguage: string, dailyGoalMinutes: number): Promise<void> {
    const user = await firstValueFrom(
      this.http.patch<User>(`${environment.apiUrl}/users/me/onboarding`, {
        preferredLanguage,
        dailyGoalMinutes,
      }),
    );
    this._currentUser.set(user);
  }

  async updateProfile(input: {
    username?: string;
    bio?: string;
    avatarIcon?: string;
    avatarColor?: string;
    pinnedAchievementSlug?: string | null;
  }): Promise<void> {
    const user = await firstValueFrom(
      this.http.patch<User>(`${environment.apiUrl}/users/me/profile`, input),
    );
    this._currentUser.set(user);
  }

  async logout(): Promise<void> {
    await this.clearSession();
  }

  // Opens GitHub's consent page in the system browser (required by GitHub;
  // an embedded webview is blocked/discouraged). The backend owns the OAuth
  // exchange, then redirects the browser to a codequest:// deep link, which
  // DeepLinkService catches and hands to completeGithubLogin() below.
  async loginWithGithub(): Promise<void> {
    await Browser.open({ url: `${environment.apiUrl}/auth/github` });
  }

  // Called by DeepLinkService once it parses accessToken/refreshToken out of
  // the codequest://auth-callback redirect. There's no user payload in the
  // deep link, so we fetch it once tokens are in place.
  async completeGithubLogin(accessToken: string, refreshToken: string): Promise<void> {
    this.setTokens(accessToken, refreshToken);
    const user = await firstValueFrom(this.http.get<User>(`${environment.apiUrl}/users/me`));
    this._currentUser.set(user);
    await this.tokenStorage.save({ accessToken, refreshToken });
  }

  // Used by the auth interceptor when a request comes back 401.
  async tryRefresh(): Promise<boolean> {
    if (!this._refreshToken) {
      return false;
    }

    try {
      const result = await firstValueFrom(
        this.http.post<AuthResult>(`${environment.apiUrl}/auth/refresh`, {
          refreshToken: this._refreshToken,
        }),
      );
      await this.applyAuthResult(result);
      return true;
    } catch {
      return false;
    }
  }

  private async applyAuthResult(result: AuthResult): Promise<void> {
    this.setTokens(result.accessToken, result.refreshToken);
    this._currentUser.set(result.user);
    await this.tokenStorage.save({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    this._accessToken.set(accessToken);
    this._refreshToken = refreshToken;
  }

  private async clearSession(): Promise<void> {
    this._accessToken.set(null);
    this._refreshToken = null;
    this._currentUser.set(null);
    await this.tokenStorage.clear();
  }
}
