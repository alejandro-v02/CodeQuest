import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonIcon, IonInput, IonSpinner, ViewWillEnter } from '@ionic/angular';
import { AuthService } from '../../../core/services/auth.service';
import { SocialService } from '../../../core/services/social.service';
import type { PostDto, UserResult } from '../../../core/models/social.model';
import { LoadingBounceComponent } from '../../../shared/components/loading-bounce/loading-bounce.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PostCardComponent } from '../components/post-card/post-card.component';
import { ComposePostSheetComponent } from '../components/compose-post-sheet/compose-post-sheet.component';
import { UserResultRowComponent } from '../components/user-result-row/user-result-row.component';
import { SuggestedUsersComponent } from '../components/suggested-users/suggested-users.component';
import { NotificationsSheetComponent } from '../components/notifications-sheet/notifications-sheet.component';
import { I18nService } from '../../../core/services/i18n.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

const SEARCH_DEBOUNCE_MS = 300;

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
  imports: [
    IonButton,
    IonContent,
    IonIcon,
    IonInput,
    IonSpinner,
    LoadingBounceComponent,
    PageHeaderComponent,
    EmptyStateComponent,
    PostCardComponent,
    ComposePostSheetComponent,
    UserResultRowComponent,
    SuggestedUsersComponent,
    NotificationsSheetComponent,
    TranslatePipe,
  ],
})
export class FeedPage implements ViewWillEnter {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly socialService = inject(SocialService);
  private readonly i18n = inject(I18nService);
  private searchDebounceHandle: ReturnType<typeof setTimeout> | null = null;

  readonly posts = signal<PostDto[]>([]);
  readonly isLoading = signal(true);
  readonly isLoadingMore = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly nextCursor = signal<string | null>(null);
  readonly isComposeOpen = signal(false);

  readonly isSearchOpen = signal(false);
  readonly searchQuery = signal('');
  readonly searchResults = signal<UserResult[]>([]);
  readonly isSearching = signal(false);

  readonly isNotificationsOpen = signal(false);
  readonly unreadCount = signal(0);

  readonly myAvatarIcon = () => this.authService.currentUser()?.avatarIcon ?? 'person-circle';
  readonly myAvatarColor = () => this.authService.currentUser()?.avatarColor ?? '#22d3ee';

  ionViewWillEnter(): void {
    void this.load();
    void this.loadUnreadCount();
  }

  openOwnProfile(): void {
    const userId = this.authService.currentUser()?.id;
    if (userId) {
      void this.router.navigateByUrl(`/profile/${userId}`);
    }
  }

  async loadUnreadCount(): Promise<void> {
    try {
      this.unreadCount.set(await this.socialService.getUnreadNotificationsCount());
    } catch {
      this.unreadCount.set(0);
    }
  }

  openNotifications(): void {
    this.isNotificationsOpen.set(true);
  }

  closeNotifications(): void {
    this.isNotificationsOpen.set(false);
  }

  onUnreadCleared(): void {
    this.unreadCount.set(0);
  }

  async load(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const page = await this.socialService.getFeed();
      this.posts.set(page.items);
      this.nextCursor.set(page.nextCursor);
    } catch {
      this.errorMessage.set(this.i18n.t('feed.errors.loadFailed'));
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

  toggleSearch(): void {
    this.isSearchOpen.update((open) => !open);
    if (!this.isSearchOpen()) {
      this.searchQuery.set('');
      this.searchResults.set([]);
    }
  }

  onSearchInput(value: string): void {
    this.searchQuery.set(value);
    if (this.searchDebounceHandle) {
      clearTimeout(this.searchDebounceHandle);
    }
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      this.searchResults.set([]);
      this.isSearching.set(false);
      return;
    }
    this.isSearching.set(true);
    this.searchDebounceHandle = setTimeout(() => {
      void this.runSearch(trimmed);
    }, SEARCH_DEBOUNCE_MS);
  }

  private async runSearch(query: string): Promise<void> {
    try {
      const results = await this.socialService.searchUsers(query);
      if (this.searchQuery().trim() === query) {
        this.searchResults.set(results);
      }
    } catch {
      this.searchResults.set([]);
    } finally {
      this.isSearching.set(false);
    }
  }

  onSearchResultChanged(updated: UserResult): void {
    this.searchResults.update((list) => list.map((u) => (u.userId === updated.userId ? updated : u)));
  }
}
