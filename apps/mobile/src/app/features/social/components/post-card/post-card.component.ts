import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { ActionSheetController, IonIcon } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { SocialService } from '../../../../core/services/social.service';
import { findAchievement } from '../../../../core/config/achievements.catalog';
import type { PostDto, ReactionSummary, SocialReportReason } from '../../../../core/models/social.model';
import { ReactionBarComponent } from '../reaction-bar/reaction-bar.component';
import { CommentsSheetComponent } from '../comments-sheet/comments-sheet.component';

const REPORT_REASONS: { reason: SocialReportReason; label: string }[] = [
  { reason: 'spam', label: 'Es spam' },
  { reason: 'offensive', label: 'Contenido ofensivo' },
  { reason: 'harassment', label: 'Acoso' },
  { reason: 'other', label: 'Otro motivo' },
];

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
  imports: [IonIcon, ReactionBarComponent, CommentsSheetComponent],
})
export class PostCardComponent {
  private readonly authService = inject(AuthService);
  private readonly socialService = inject(SocialService);
  private readonly actionSheetController = inject(ActionSheetController);
  private readonly router = inject(Router);

  readonly post = input.required<PostDto>();
  readonly deleted = output<string>();

  private readonly override = signal<{ reactions?: ReactionSummary; commentCount?: number } | null>(
    null,
  );
  readonly isCommentsOpen = signal(false);

  readonly displayPost = computed<PostDto>(() => {
    const base = this.post();
    const patch = this.override();
    return patch ? { ...base, ...patch } : base;
  });

  readonly isMine = computed(() => this.authService.currentUser()?.id === this.post().authorId);

  constructor() {
    effect(() => {
      this.post();
      this.override.set(null);
    });
  }

  achievementTitle(slug: string | null): string {
    if (!slug) {
      return '';
    }
    return findAchievement(slug)?.title ?? 'Logro desbloqueado';
  }

  achievementDescription(slug: string | null): string {
    if (!slug) {
      return '';
    }
    return findAchievement(slug)?.description ?? '';
  }

  achievementIcon(slug: string | null): string {
    if (!slug) {
      return 'trophy-outline';
    }
    return findAchievement(slug)?.icon ?? 'trophy-outline';
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

  onReactionsChanged(reactions: ReactionSummary): void {
    this.override.update((current) => ({ ...current, reactions }));
  }

  onCommentCountChanged(count: number): void {
    this.override.update((current) => ({ ...current, commentCount: count }));
  }

  openComments(): void {
    this.isCommentsOpen.set(true);
  }

  closeComments(): void {
    this.isCommentsOpen.set(false);
  }

  openAuthorProfile(): void {
    void this.router.navigateByUrl(`/profile/${this.post().authorId}`);
  }

  async openMenu(): Promise<void> {
    const post = this.post();
    const buttons = this.isMine()
      ? [
          {
            text: 'Borrar publicación',
            role: 'destructive' as const,
            handler: () => void this.remove(post.id),
          },
          { text: 'Cancelar', role: 'cancel' as const },
        ]
      : [
          ...REPORT_REASONS.map(({ reason, label }) => ({
            text: label,
            handler: () => void this.report(post.id, reason),
          })),
          { text: 'Cancelar', role: 'cancel' as const },
        ];

    const sheet = await this.actionSheetController.create({
      header: this.isMine() ? 'Esta publicación' : '¿Qué está mal con esta publicación?',
      buttons,
    });
    await sheet.present();
  }

  private async remove(postId: string): Promise<void> {
    try {
      await this.socialService.deletePost(postId);
      this.deleted.emit(postId);
    } catch {
      // Silently ignored — the post stays visible, user can retry from the menu.
    }
  }

  private async report(postId: string, reason: SocialReportReason): Promise<void> {
    try {
      await this.socialService.report('post', postId, reason);
    } catch {
      // Silently ignored — reporting has no visible confirmation state in v1.
    }
  }
}
