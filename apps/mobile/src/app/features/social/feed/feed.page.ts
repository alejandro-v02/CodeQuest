import { Component, inject, signal } from '@angular/core';
import { IonButton, IonContent, IonIcon, IonSpinner, ViewWillEnter } from '@ionic/angular';
import { SocialService } from '../../../core/services/social.service';
import type { PostDto } from '../../../core/models/social.model';
import { LoadingBounceComponent } from '../../../shared/components/loading-bounce/loading-bounce.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PostCardComponent } from '../components/post-card/post-card.component';
import { ComposePostSheetComponent } from '../components/compose-post-sheet/compose-post-sheet.component';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
  imports: [
    IonButton,
    IonContent,
    IonIcon,
    IonSpinner,
    LoadingBounceComponent,
    PageHeaderComponent,
    EmptyStateComponent,
    PostCardComponent,
    ComposePostSheetComponent,
  ],
})
export class FeedPage implements ViewWillEnter {
  private readonly socialService = inject(SocialService);

  readonly posts = signal<PostDto[]>([]);
  readonly isLoading = signal(true);
  readonly isLoadingMore = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly nextCursor = signal<string | null>(null);
  readonly isComposeOpen = signal(false);

  ionViewWillEnter(): void {
    void this.load();
  }

  async load(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const page = await this.socialService.getFeed();
      this.posts.set(page.items);
      this.nextCursor.set(page.nextCursor);
    } catch {
      this.errorMessage.set('No se pudo cargar el muro.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async loadMore(): Promise<void> {
    const cursor = this.nextCursor();
    if (!cursor || this.isLoadingMore()) {
      return;
    }
    this.isLoadingMore.set(true);
    try {
      const page = await this.socialService.getFeed(cursor);
      this.posts.update((current) => [...current, ...page.items]);
      this.nextCursor.set(page.nextCursor);
    } finally {
      this.isLoadingMore.set(false);
    }
  }

  onPosted(post: PostDto): void {
    this.posts.update((current) => [post, ...current]);
  }

  onDeleted(postId: string): void {
    this.posts.update((current) => current.filter((p) => p.id !== postId));
  }

  openCompose(): void {
    this.isComposeOpen.set(true);
  }

  closeCompose(): void {
    this.isComposeOpen.set(false);
  }
}
