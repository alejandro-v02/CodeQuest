import { Component, inject, input, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonIcon, IonModal } from '@ionic/angular';
import { SocialService } from '../../../../core/services/social.service';
import type { NotificationItem } from '../../../../core/models/social.model';
import { LoadingBounceComponent } from '../../../../shared/components/loading-bounce/loading-bounce.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

const TYPE_ICON: Record<NotificationItem['type'], string> = {
  follow: 'person-add-outline',
  reaction: 'flame',
  comment: 'chatbubble-outline',
};

const TYPE_MESSAGE: Record<NotificationItem['type'], string> = {
  follow: 'empezó a seguirte',
  reaction: 'reaccionó a tu publicación',
  comment: 'comentó tu publicación',
};

@Component({
  selector: 'app-notifications-sheet',
  templateUrl: './notifications-sheet.component.html',
  styleUrls: ['./notifications-sheet.component.scss'],
  imports: [IonContent, IonIcon, IonModal, LoadingBounceComponent, EmptyStateComponent],
})
export class NotificationsSheetComponent {
  private readonly router = inject(Router);
  private readonly socialService = inject(SocialService);

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
      this.errorMessage.set('No se pudieron cargar las notificaciones.');
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
    return TYPE_MESSAGE[notification.type];
  }

  open(notification: NotificationItem): void {
    this.closed.emit();
    void this.router.navigateByUrl(`/profile/${notification.actorId}`);
  }

  timeAgo(iso: string): string {
    const diffMs = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diffMs / 60_000);
    if (minutes < 1) {
      return 'ahora';
    }
    if (minutes < 60) {
      return `hace ${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `hace ${hours} h`;
    }
    const days = Math.floor(hours / 24);
    if (days < 7) {
      return `hace ${days} d`;
    }
    return new Date(iso).toLocaleDateString();
  }
}
