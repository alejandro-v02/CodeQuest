import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { AuthService } from './auth.service';

// Catches the codequest://auth-callback redirect the system browser follows
// after GitHub OAuth (see apps/api AuthController#githubCallback). Registered
// once at app start via provideAppInitializer in app.config.ts.
@Injectable({ providedIn: 'root' })
export class DeepLinkService {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  init(): void {
    App.addListener('appUrlOpen', ({ url }) => {
      void this.handleUrl(url);
    });
  }

  private async handleUrl(url: string): Promise<void> {
    if (!url.startsWith('codequest://auth-callback')) {
      return;
    }

    // Close the system browser tab the OAuth flow opened, if still open.
    await Browser.close().catch(() => undefined);

    const { searchParams } = new URL(url);
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    if (!accessToken || !refreshToken) {
      return;
    }

    try {
      await this.authService.completeGithubLogin(accessToken, refreshToken);
      await this.router.navigateByUrl('/tabs/home');
    } catch {
      await this.router.navigateByUrl('/auth/login');
    }
  }
}
