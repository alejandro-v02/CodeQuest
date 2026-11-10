import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonIcon, IonModal, IonSpinner, IonTextarea, IonToggle } from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';
import { GamificationService } from '../../core/services/gamification.service';
import { NotificationsService } from '../../core/services/notifications.service';
import { AVATAR_COLORS, AVATAR_ICONS } from '../../core/config/avatar-options';
import type { AchievementStatus } from '../../core/models/gamification.model';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  imports: [
    FormsModule,
    IonContent,
    IonButton,
    IonIcon,
    IonModal,
    IonSpinner,
    IonTextarea,
    IonToggle,
    PageHeaderComponent,
  ],
})
export class ProfilePage implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly gamificationService = inject(GamificationService);
  private readonly notificationsService = inject(NotificationsService);
  private readonly router = inject(Router);

  readonly user = this.authService.currentUser;
  readonly reminderEnabled = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly avatarIcons = AVATAR_ICONS;
  readonly avatarColors = AVATAR_COLORS;
  readonly unlockedAchievements = signal<AchievementStatus[]>([]);

  readonly isEditOpen = signal(false);
  readonly editBio = signal('');
  readonly editAvatarIcon = signal<string>(AVATAR_ICONS[0]);
  readonly editAvatarColor = signal<string>(AVATAR_COLORS[0]);
  readonly editPinnedSlug = signal<string | null>(null);
  readonly isSavingProfile = signal(false);
  readonly profileError = signal<string | null>(null);

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

  openOwnPublicProfile(): void {
    const userId = this.user()?.id;
    if (userId) {
      void this.router.navigateByUrl(`/profile/${userId}`);
    }
  }

  async openEditProfile(): Promise<void> {
    const current = this.user();
    if (!current) {
      return;
    }
    this.editBio.set(current.bio ?? '');
    this.editAvatarIcon.set(current.avatarIcon);
    this.editAvatarColor.set(current.avatarColor);
    this.editPinnedSlug.set(current.pinnedAchievementSlug);
    this.profileError.set(null);
    this.isEditOpen.set(true);

    try {
      const summary = await this.gamificationService.getSummary();
      this.unlockedAchievements.set(summary.achievements.filter((a) => a.unlockedAt !== null));
    } catch {
      this.unlockedAchievements.set([]);
    }
  }

  closeEditProfile(): void {
    this.isEditOpen.set(false);
  }

  togglePinned(slug: string): void {
    this.editPinnedSlug.set(this.editPinnedSlug() === slug ? null : slug);
  }

  async saveProfile(): Promise<void> {
    if (this.isSavingProfile()) {
      return;
    }
    this.isSavingProfile.set(true);
    this.profileError.set(null);
    try {
      await this.authService.updateProfile({
        bio: this.editBio().trim(),
        avatarIcon: this.editAvatarIcon(),
        avatarColor: this.editAvatarColor(),
        pinnedAchievementSlug: this.editPinnedSlug(),
      });
      this.isEditOpen.set(false);
    } catch {
      this.profileError.set('No se pudo guardar tu perfil.');
    } finally {
      this.isSavingProfile.set(false);
    }
  }
}
