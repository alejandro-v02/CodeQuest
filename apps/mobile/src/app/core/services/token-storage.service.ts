import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

const ACCESS_TOKEN_KEY = 'codequest.accessToken';
const REFRESH_TOKEN_KEY = 'codequest.refreshToken';

export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
}

// Thin wrapper around @capacitor/preferences. Note: this is plain persistent
// key-value storage, not OS keychain-level encryption — fine for Fase 2, but
// a hardening candidate later (see PLAN.md decision notes).
@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  async read(): Promise<StoredTokens | null> {
    const [access, refresh] = await Promise.all([
      Preferences.get({ key: ACCESS_TOKEN_KEY }),
      Preferences.get({ key: REFRESH_TOKEN_KEY }),
    ]);

    if (!access.value || !refresh.value) {
      return null;
    }

    return { accessToken: access.value, refreshToken: refresh.value };
  }

  async save(tokens: StoredTokens): Promise<void> {
    await Promise.all([
      Preferences.set({ key: ACCESS_TOKEN_KEY, value: tokens.accessToken }),
      Preferences.set({ key: REFRESH_TOKEN_KEY, value: tokens.refreshToken }),
    ]);
  }

  async clear(): Promise<void> {
    await Promise.all([
      Preferences.remove({ key: ACCESS_TOKEN_KEY }),
      Preferences.remove({ key: REFRESH_TOKEN_KEY }),
    ]);
  }
}
