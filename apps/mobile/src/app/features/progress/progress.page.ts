import { Component, computed, inject, signal } from '@angular/core';
import { IonButton, IonContent, IonIcon, ViewWillEnter } from '@ionic/angular';
import { GamificationService } from '../../core/services/gamification.service';
import type {
  GamificationSummary,
  RankingResponse,
} from '../../core/models/gamification.model';
import { LoadingBounceComponent } from '../../shared/components/loading-bounce/loading-bounce.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

const XP_PER_LEVEL = 100;

@Component({
  selector: 'app-progress',
  templateUrl: './progress.page.html',
  styleUrls: ['./progress.page.scss'],
  imports: [IonButton, IonContent, IonIcon, LoadingBounceComponent, PageHeaderComponent],
})
export class ProgressPage implements ViewWillEnter {
  private readonly gamificationService = inject(GamificationService);

  readonly summary = signal<GamificationSummary | null>(null);
  readonly ranking = signal<RankingResponse | null>(null);
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
      const [summary, ranking] = await Promise.all([
        this.gamificationService.getSummary(),
        this.gamificationService.getRanking(),
      ]);
      this.summary.set(summary);
      this.ranking.set(ranking);
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
}
