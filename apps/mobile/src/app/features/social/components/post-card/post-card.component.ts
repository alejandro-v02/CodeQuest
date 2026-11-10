import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { IonIcon, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { SocialService } from '../../../../core/services/social.service';
import { findAchievement } from '../../../../core/config/achievements.catalog';
import type { PostDto, ReactionSummary, SocialReportReason } from '../../../../core/models/social.model';
import { ReactionBarComponent } from '../reaction-bar/reaction-bar.component';
import { CommentsSheetComponent } from '../comments-sheet/comments-sheet.component';
import { PostMenuSheetComponent } from '../post-menu-sheet/post-menu-sheet.component';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
  imports: [IonIcon, ReactionBarComponent, CommentsSheetComponent, PostMenuSheetComponent],
})
export class PostCardComponent {
  private readonly authService = inject(AuthService);
  private readonly socialService = inject(SocialService);
  private readonly toastController = inject(ToastController);
  private readonly router = inject(Router);

  readonly post = input.required<PostDto>();
  readonly delayMs = input(0);
  readonly deleted = output<string>();

  private readonly override = signal<{ reactions?: ReactionSummary; commentCount?: number } | null>(
    null,
  );
  readonly isCommentsOpen = signal(false);
  readonly isMenuOpen = signal(false);

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

  openMenu(): void {
    this.isMenuOpen.set(true);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  async onDeleteRequested(): Promise<void> {
    this.isMenuOpen.set(false);
    const postId = this.post().id;
    try {
      await this.socialService.deletePost(postId);
      this.deleted.emit(postId);
      await this.showToast('Publicación borrada.');
    } catch {
      await this.showToast('No se pudo borrar la publicación. Intenta de nuevo.', true);
    }
  }

  async onReportRequested(reason: SocialReportReason): Promise<void> {
    this.isMenuOpen.set(false);
    const postId = this.post().id;
    try {
      await this.socialService.report('post', postId, reason);
      await this.showToast('Gracias, revisaremos esta publicación.');
    } catch {
      await this.showToast('No se pudo enviar el reporte. Intenta de nuevo.', true);
    }
  }

  private async showToast(message: string, isError = false): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2200,
      position: 'top',
      color: isError ? 'danger' : 'secondary',
    });
    await toast.present();
  }
}
