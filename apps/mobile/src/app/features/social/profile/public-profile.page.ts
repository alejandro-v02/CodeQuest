import { Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonButton, IonContent, IonIcon, ViewWillEnter } from '@ionic/angular';
import { AuthService } from '../../../core/services/auth.service';
import { SocialService } from '../../../core/services/social.service';
import type { HeatmapDay, PostDto, ProfileResponse } from '../../../core/models/social.model';
import { LoadingBounceComponent } from '../../../shared/components/loading-bounce/loading-bounce.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PostCardComponent } from '../components/post-card/post-card.component';
import { ContributionHeatmapComponent } from '../components/contribution-heatmap/contribution-heatmap.component';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.page.html',
  styleUrls: ['./public-profile.page.scss'],
  imports: [
    IonButton,
    IonContent,
    IonIcon,
    LoadingBounceComponent,
    PageHeaderComponent,
    EmptyStateComponent,
    PostCardComponent,
    ContributionHeatmapComponent,
  ],
})
export class PublicProfilePage implements ViewWillEnter {
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly authService = inject(AuthService);
  private readonly socialService = inject(SocialService);

  readonly profile = signal<ProfileResponse | null>(null);
  readonly heatmap = signal<HeatmapDay[]>([]);
  readonly wall = signal<PostDto[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly isFollowBusy = signal(false);

  readonly myUserId = () => this.authService.currentUser()?.id ?? null;

  ionViewWillEnter(): void {
    void this.load();
  }

  async load(): Promise<void> {
    const userId = this.route.snapshot.paramMap.get('userId');
    if (!userId) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const profile = await this.socialService.getProfile(userId);
      this.profile.set(profile);

      if (profile.unlocked) {
        const [heatmap, wall] = await Promise.all([
          this.socialService.getHeatmap(userId),
          this.socialService.getWall(userId),
        ]);
        this.heatmap.set(heatmap);
        this.wall.set(wall.items);
      }
    } catch {
      this.errorMessage.set('No se pudo cargar este perfil.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async toggleFollow(): Promise<void> {
    const profile = this.profile();
    if (!profile || this.isFollowBusy()) {
      return;
    }

    this.isFollowBusy.set(true);
    try {
      if (profile.isFollowedByMe) {
        await this.socialService.unfollow(profile.userId);
      } else {
        await this.socialService.follow(profile.userId);
      }
      await this.load();
    } finally {
      this.isFollowBusy.set(false);
    }
  }

  onDeleted(postId: string): void {
    this.wall.update((current) => current.filter((p) => p.id !== postId));
  }

  goBack(): void {
    this.location.back();
  }
}
