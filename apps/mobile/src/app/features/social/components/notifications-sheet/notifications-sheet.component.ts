import { Component, ViewChild, inject, input, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonIcon, IonModal } from '@ionic/angular';
import { SocialService } from '../../../../core/services/social.service';
import type { NotificationItem } from '../../../../core/models/social.model';
import { LoadingBounceComponent } from '../../../../shared/components/loading-bounce/loading-bounce.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { I18nService } from '../../../../core/services/i18n.service';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

const TYPE_ICON: Record<NotificationItem['type'], string> = {
  follow: 'person-add-outline',
  reaction: 'flame',
  comment: 'chatbubble-outline',
};

const TYPE_MESSAGE_KEY: Record<NotificationItem['type'], string> = {
  follow: 'notifications.type.follow',
  reaction: 'notifications.type.reaction',
  comment: 'notifications.type.comment',
};

@Component({
  selector: 'app-notifications-sheet',
  templateUrl: './notifications-sheet.component.html',
  styleUrls: ['./notifications-sheet.component.scss'],
  imports: [IonContent, IonIcon, IonModal, LoadingBounceComponent, EmptyStateComponent, TranslatePipe],
})
export class NotificationsSheetComponent {
  private readonly router = inject(Router);
  private readonly socialService = inject(SocialService);
  private readonly i18n = inject(I18nService);

  @ViewChild(IonModal) private readonly modal?: IonModal;

  readonly isOpen = input.required<boolean>();
  readonly closed = output<void>();
  readonly unreadCleared = output<void>();

  readonly notifications = signal<NotificationItem[]>([]);
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  async onWillPresent(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    try {
      this.notifications.set(await this.socialService.getNotifications());
      const hasUnread = this.notifications().some((n) => !n.read);
      if (hasUnread) {
        await this.socialService.markNotificationsRead();
        this.unreadCleared.emit();
      }
    } catch {
      this.errorMessage.set(this.i18n.t('notifications.errors.loadFailed'));
    } finally {
      this.isLoading.set(false);
    }
  }

  dismiss(): void {
    this.closed.emit();
  }

  iconFor(notification: NotificationItem): string {
    return TYPE_ICON[notification.type];
  }

  messageFor(notification: NotificationItem): string {
    return this.i18n.t(TYPE_MESSAGE_KEY[notification.type]);
  }

  async open(notification: NotificationItem): Promise<void> {
    this.closed.emit();
    // Await the dismiss animation before navigating — otherwise the modal,
    // which lives outside the router outlet, can still be mid-close or
    // fully open on top of the page we just routed to.
    await this.modal?.dismiss();
    await this.router.navigateByUrl(`/profile/${notification.actorId}`);
  }

  timeAgo(iso: string): string {
    const diffMs = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diffMs / 60_000);
    if (minutes < 1) {
      return this.i18n.t('postCard.justNow');
    }
    if (minutes < 60) {
      return this.i18n.t('postCard.minutesAgo').replace('{n}', String(minutes));
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return this.i18n.t('postCard.hoursAgo').replace('{n}', String(hours));
    }
    const days = Math.floor(hours / 24);
    if (days < 7) {
      return this.i18n.t('postCard.daysAgo').replace('{n}', String(days));
    }
    return new Date(iso).toLocaleDateString();
  }
}
