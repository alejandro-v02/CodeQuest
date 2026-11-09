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
  readonly errorMessage = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    try {
      this.reminderEnabled.set(await this.notificationsService.isReminderEnabled());
    } catch {
      this.errorMessage.set('No se pudo cargar el estado del recordatorio.');
    }
  }

  async toggleReminder(enabled: boolean): Promise<void> {
    this.errorMessage.set(null);
    try {
      if (enabled) {
        const granted = await this.notificationsService.enableDailyReminder(
          this.user()?.dailyGoalMinutes ?? null,
        );
        this.reminderEnabled.set(granted);
      } else {
        await this.notificationsService.disableDailyReminder();
        this.reminderEnabled.set(false);
      }
    } catch {
      this.errorMessage.set('No se pudo actualizar el recordatorio.');
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
