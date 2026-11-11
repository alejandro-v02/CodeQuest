import { Component, effect, inject, input, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonIcon, IonModal, IonToggle } from '@ionic/angular';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { AuthService } from '../../../core/services/auth.service';
import { I18nService, type AppLanguage } from '../../../core/services/i18n.service';
import { NotificationsService } from '../../../core/services/notifications.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

// Bottom sheet opened from the gear in the Profile header: app preferences
// (language, daily reminder) plus the account actions (admin panel, logout).
@Component({
  selector: 'app-settings-sheet',
  templateUrl: './settings-sheet.component.html',
  styleUrls: ['./settings-sheet.component.scss'],
  imports: [IonButton, IonContent, IonIcon, IonModal, IonToggle, TranslatePipe],
})
export class SettingsSheetComponent {
  private readonly authService = inject(AuthService);
  private readonly notificationsService = inject(NotificationsService);
  private readonly analytics = inject(AnalyticsService);
  private readonly router = inject(Router);
  readonly i18n = inject(I18nService);

  readonly isOpen = input.required<boolean>();
  readonly closed = output<void>();

  readonly reminderEnabled = signal(false);
  readonly errorMessage = signal<string | null>(null);

  constructor() {
    // The reminder state lives in device storage, so it's read each time the
    // sheet opens rather than once at startup.
    effect(() => {
      if (this.isOpen()) {
        void this.loadReminder();
      }
    });
  }

  private async loadReminder(): Promise<void> {
    this.errorMessage.set(null);
    try {
      this.reminderEnabled.set(await this.notificationsService.isReminderEnabled());
    } catch {
      this.errorMessage.set(this.i18n.t('profile.errors.reminderLoadFailed'));
    }
  }

  async setAppLanguage(lang: AppLanguage): Promise<void> {
    await this.i18n.setLanguage(lang);
    this.analytics.track('language_changed', { to: lang });
  }

  async toggleReminder(enabled: boolean): Promise<void> {
    this.errorMessage.set(null);
    try {
      if (enabled) {
        const granted = await this.notificationsService.enableDailyReminder(
          this.authService.currentUser()?.dailyGoalMinutes ?? null,
        );
        this.reminderEnabled.set(granted);
      } else {
        await this.notificationsService.disableDailyReminder();
        this.reminderEnabled.set(false);
      }
    } catch {
      this.errorMessage.set(this.i18n.t('profile.errors.reminderUpdateFailed'));
    }
  }

  openAdmin(): void {
    this.closed.emit();
    void this.router.navigateByUrl('/admin');
  }

  async logout(): Promise<void> {
    this.closed.emit();
    await this.authService.logout();
    await this.router.navigateByUrl('/auth/login');
  }
}
