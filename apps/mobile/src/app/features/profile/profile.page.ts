import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonButton, IonIcon, IonToggle } from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';
import { NotificationsService } from '../../core/services/notifications.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  imports: [IonContent, IonButton, IonIcon, IonToggle, PageHeaderComponent],
})
export class ProfilePage implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly notificationsService = inject(NotificationsService);
  private readonly router = inject(Router);

  readonly user = this.authService.currentUser;
  readonly reminderEnabled = signal(false);

  async ngOnInit(): Promise<void> {
    this.reminderEnabled.set(await this.notificationsService.isReminderEnabled());
  }

  async toggleReminder(enabled: boolean): Promise<void> {
    if (enabled) {
      const granted = await this.notificationsService.enableDailyReminder(
        this.user()?.dailyGoalMinutes ?? null,
      );
      this.reminderEnabled.set(granted);
    } else {
      await this.notificationsService.disableDailyReminder();
      this.reminderEnabled.set(false);
    }
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    await this.router.navigateByUrl('/auth/login');
  }

  openAdmin(): void {
    void this.router.navigateByUrl('/admin');
  }
}
