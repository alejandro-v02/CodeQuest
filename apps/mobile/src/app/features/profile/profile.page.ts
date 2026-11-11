import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonInput,
  IonModal,
  IonSpinner,
  IonTextarea,
  ViewWillEnter,
} from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';
import { GamificationService } from '../../core/services/gamification.service';
import { AVATAR_COLORS, AVATAR_ICONS } from '../../core/config/avatar-options';
import { findAchievement } from '../../core/config/achievements.catalog';
import type { AchievementStatus, GamificationSummary } from '../../core/models/gamification.model';
import { LANGUAGE_OPTIONS, type ProgrammingLanguageSlug } from '../../core/models/user.model';
import { LanguageBadgeComponent } from '../../shared/components/language-badge/language-badge.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { I18nService } from '../../core/services/i18n.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { SettingsSheetComponent } from './settings-sheet/settings-sheet.component';

const MIN_USERNAME_LENGTH = 6;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  imports: [
    FormsModule,
    IonContent,
    IonButton,
    IonIcon,
    IonInput,
    IonModal,
    IonSpinner,
    IonTextarea,
    LanguageBadgeComponent,
    PageHeaderComponent,
    SettingsSheetComponent,
    TranslatePipe,
  ],
})
export class ProfilePage implements ViewWillEnter {
  private readonly authService = inject(AuthService);
  private readonly gamificationService = inject(GamificationService);
  private readonly router = inject(Router);
  private readonly i18n = inject(I18nService);

  readonly user = this.authService.currentUser;
  readonly summary = signal<GamificationSummary | null>(null);
  readonly isSettingsOpen = signal(false);

  readonly avatarIcons = AVATAR_ICONS;
  readonly avatarColors = AVATAR_COLORS;
  readonly unlockedAchievements = signal<AchievementStatus[]>([]);

  readonly isEditOpen = signal(false);
  readonly editUsername = signal('');
  readonly editBio = signal('');
  readonly editAvatarIcon = signal<string>(AVATAR_ICONS[0]);
  readonly editAvatarColor = signal<string>(AVATAR_COLORS[0]);
  readonly editPinnedSlug = signal<string | null>(null);
  readonly isSavingProfile = signal(false);
  readonly profileError = signal<string | null>(null);

  // The level/XP/streak tiles should be fresh every time the tab is shown.
  ionViewWillEnter(): void {
    void this.loadSummary();
  }

  private async loadSummary(): Promise<void> {
    try {
      this.summary.set(await this.gamificationService.getSummary());
    } catch {
      // Stats are decoration here: without them the tiles just don't show.
      this.summary.set(null);
    }
  }

  openSettings(): void {
    this.isSettingsOpen.set(true);
  }

  closeSettings(): void {
    this.isSettingsOpen.set(false);
  }

  openGroups(): void {
    void this.router.navigateByUrl('/groups');
  }

  openLeague(): void {
    void this.router.navigateByUrl('/league');
  }

  openOwnPublicProfile(): void {
    const userId = this.user()?.id;
    if (userId) {
      void this.router.navigateByUrl(`/profile/${userId}`);
    }
  }

  languageLabel(slug: ProgrammingLanguageSlug): string {
    return LANGUAGE_OPTIONS.find((option) => option.slug === slug)?.label ?? slug;
  }

  goalLabel(minutes: number | null): string {
    return minutes ? this.i18n.t('profile.goalValue').replace('{n}', String(minutes)) : '—';
  }

  pinnedAchievement(): { icon: string; title: string } | null {
    const slug = this.user()?.pinnedAchievementSlug;
    const definition = slug ? findAchievement(slug) : undefined;
    if (!slug || !definition) {
      return null;
    }
    return { icon: definition.icon, title: this.i18n.t(`achievements.${slug}.title`) };
  }

  async openEditProfile(): Promise<void> {
    const current = this.user();
    if (!current) {
      return;
    }
    this.editUsername.set(current.username ?? '');
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

  onUsernameInput(value: string): void {
    this.editUsername.set(value.toLowerCase().replace(/[^a-z0-9_]/g, ''));
  }

  async saveProfile(): Promise<void> {
    if (this.isSavingProfile()) {
      return;
    }
    const username = this.editUsername().trim();
    if (username.length > 0 && username.length < MIN_USERNAME_LENGTH) {
      this.profileError.set(
        this.i18n
          .t('profile.errors.usernameTooShort')
          .replace('{min}', String(MIN_USERNAME_LENGTH)),
      );
      return;
    }

    this.isSavingProfile.set(true);
    this.profileError.set(null);
    try {
      await this.authService.updateProfile({
        ...(username.length > 0 ? { username } : {}),
        bio: this.editBio().trim(),
        avatarIcon: this.editAvatarIcon(),
        avatarColor: this.editAvatarColor(),
        pinnedAchievementSlug: this.editPinnedSlug(),
      });
      this.editUsername.set(this.user()?.username ?? '');
      this.isEditOpen.set(false);
    } catch (error) {
      this.profileError.set(
        this.i18n.t(
          error instanceof HttpErrorResponse && error.status === 409
            ? 'profile.errors.usernameTaken'
            : 'profile.errors.saveFailed',
        ),
      );
    } finally {
      this.isSavingProfile.set(false);
    }
  }
}
