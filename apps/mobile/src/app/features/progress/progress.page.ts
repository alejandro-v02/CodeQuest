import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonIcon, ViewWillEnter } from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';
import { ExercisesService } from '../../core/services/exercises.service';
import { GamificationService } from '../../core/services/gamification.service';
import type { StatsSummary } from '../../core/models/exercise.model';
import type {
  GamificationSummary,
  RankingResponse,
} from '../../core/models/gamification.model';
import { LoadingBounceComponent } from '../../shared/components/loading-bounce/loading-bounce.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

const XP_PER_LEVEL = 100;

@Component({
  selector: 'app-progress',
  templateUrl: './progress.page.html',
  styleUrls: ['./progress.page.scss'],
  imports: [
    IonButton,
    IonContent,
    IonIcon,
    LoadingBounceComponent,
    PageHeaderComponent,
    EmptyStateComponent,
  ],
})
export class ProgressPage implements ViewWillEnter {
  private readonly authService = inject(AuthService);
  private readonly exercisesService = inject(ExercisesService);
  private readonly gamificationService = inject(GamificationService);
  private readonly router = inject(Router);

  readonly summary = signal<GamificationSummary | null>(null);
  readonly ranking = signal<RankingResponse | null>(null);
  readonly stats = signal<StatsSummary | null>(null);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  readonly meInTop = computed(() => {
    const r = this.ranking();
    return r ? r.top.some((entry) => entry.userId === r.me.userId) : false;
  });

  ionViewWillEnter(): void {
    void this.load();
  }

  async load(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const language = this.authService.currentUser()?.preferredLanguage;
      const [summary, ranking, stats] = await Promise.all([
        this.gamificationService.getSummary(),
        this.gamificationService.getRanking(),
        // A missing preferredLanguage shouldn't block XP/streak/ranking —
        // stats just stay null (section is omitted) in that edge case.
        language ? this.exercisesService.getStatsSummary(language) : Promise.resolve(null),
      ]);
      this.summary.set(summary);
      this.ranking.set(ranking);
      this.stats.set(stats);
    } catch {
      this.errorMessage.set('No se pudo cargar tu progreso.');
    } finally {
      this.isLoading.set(false);
    }
  }

  xpIntoLevel(xp: number): number {
    return xp % XP_PER_LEVEL;
  }

  xpProgressPercent(xp: number): number {
    return (this.xpIntoLevel(xp) / XP_PER_LEVEL) * 100;
  }

  accuracyPercent(accuracy: number | null): string {
    return accuracy === null ? '—' : `${Math.round(accuracy * 100)}%`;
  }

  openProfile(userId: string): void {
    void this.router.navigateByUrl(`/profile/${userId}`);
  }
}
