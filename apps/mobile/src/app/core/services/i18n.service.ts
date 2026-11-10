import { Injectable, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

export type AppLanguage = 'es' | 'en';

const LANGUAGE_KEY = 'app_language';
const DEFAULT_LANGUAGE: AppLanguage = 'es';

// Hand-rolled instead of a library (ngx-translate etc.) — this app has no
// i18n dependency yet, and a flat `{"page.key": "text"}` JSON per language
// plus a single impure pipe covers everything this app needs without
// pulling in a library whose Angular-version support is unproven on this
// app's bleeding-edge Angular release.
@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly language = signal<AppLanguage>(DEFAULT_LANGUAGE);
  private dictionaries: Record<AppLanguage, Record<string, string>> = { es: {}, en: {} };

  async init(): Promise<void> {
    const [es, en, stored] = await Promise.all([
      this.loadDictionary('es'),
      this.loadDictionary('en'),
      Preferences.get({ key: LANGUAGE_KEY }),
    ]);
    this.dictionaries = { es, en };
    this.language.set(stored.value === 'en' ? 'en' : DEFAULT_LANGUAGE);
  }

  async setLanguage(lang: AppLanguage): Promise<void> {
    this.language.set(lang);
    await Preferences.set({ key: LANGUAGE_KEY, value: lang });
  }

  t(key: string): string {
    return this.dictionaries[this.language()][key] ?? key;
  }

  private async loadDictionary(lang: AppLanguage): Promise<Record<string, string>> {
    try {
      const response = await fetch(`assets/i18n/${lang}.json`);
      return await response.json();
    } catch {
      return {};
    }
  }
}
