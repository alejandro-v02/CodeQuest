import { Injectable, inject } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Preferences } from '@capacitor/preferences';
import { I18nService } from './i18n.service';

const REMINDER_ENABLED_KEY = 'codequest.dailyReminderEnabled';
const REMINDER_NOTIFICATION_ID = 1;
// Fixed hour MVP (PLAN.md Fase 6) — local notifications can't check server
// state when they fire, so there's no "already met your goal" suppression.
const REMINDER_HOUR = 20;

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly i18n = inject(I18nService);

  async isReminderEnabled(): Promise<boolean> {
    const { value } = await Preferences.get({ key: REMINDER_ENABLED_KEY });
    return value === 'true';
  }

  // Returns false (and leaves the toggle off) if the user denies the OS
  // permission prompt.
  async enableDailyReminder(dailyGoalMinutes: number | null): Promise<boolean> {
    const { display } = await LocalNotifications.requestPermissions();
    if (display !== 'granted') {
      return false;
    }

    const body = dailyGoalMinutes
      ? this.i18n.t('reminder.bodyWithGoal').replace('{minutes}', String(dailyGoalMinutes))
      : this.i18n.t('reminder.bodyNoGoal');
    await LocalNotifications.schedule({
      notifications: [
        {
          id: REMINDER_NOTIFICATION_ID,
          title: this.i18n.t('reminder.title'),
          body,
          schedule: { on: { hour: REMINDER_HOUR, minute: 0 }, repeats: true, allowWhileIdle: true },
        },
      ],
    });
    await Preferences.set({ key: REMINDER_ENABLED_KEY, value: 'true' });
    return true;
  }

  async disableDailyReminder(): Promise<void> {
    await LocalNotifications.cancel({ notifications: [{ id: REMINDER_NOTIFICATION_ID }] });
    await Preferences.set({ key: REMINDER_ENABLED_KEY, value: 'false' });
  }
}
