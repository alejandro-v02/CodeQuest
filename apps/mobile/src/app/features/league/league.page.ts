import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonIcon, ViewWillEnter } from '@ionic/angular';
import { I18nService } from '../../core/services/i18n.service';
import { LeaguesService } from '../../core/services/leagues.service';
import type { League } from '../../core/models/league.model';
import { LoadingBounceComponent } from '../../shared/components/loading-bounce/loading-bounce.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

const HOUR_MS = 60 * 60 * 1000;

@Component({
  selector: 'app-league',
  templateUrl: './league.page.html',
  styleUrls: ['./league.page.scss'],
  imports: [IonButton, IonContent, IonIcon, LoadingBounceComponent, PageHeaderComponent, TranslatePipe],
})
export class LeaguePage implements OnInit, ViewWillEnter {
  private readonly leaguesService = inject(LeaguesService);
  private readonly router = inject(Router);
  private readonly i18n = inject(I18nService);

  readonly league = signal<League | null>(null);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  readonly showPromoteHint = computed(() => {
    const league = this.league();
    return !!league && league.zoneSize > 0 && league.tier < league.maxTier;
  });
  readonly showDemoteHint = computed(() => {
    const league = this.league();
    return !!league && league.zoneSize > 0 && league.tier > 0;
  });

  private inFlight: Promise<void> | null = null;

  // Root-level route entered from the tabs' nested outlet: ngOnInit covers a
  // fresh instance, ionViewWillEnter a cached one, the guard dedupes.
  ngOnInit(): void {
    void this.load();
  }

  ionViewWillEnter(): void {
    void this.load();
  }

  load(): Promise<void> {
    this.inFlight ??= this.fetchLeague().finally(() => {
      this.inFlight = null;
    });
    return this.inFlight;
  }

  private async fetchLeague(): Promise<void> {
    this.isLoading.set(this.league() === null);
    this.errorMessage.set(null);
    try {
      this.league.set(await this.leaguesService.getMine());
    } catch {
      this.errorMessage.set(this.i18n.t('league.errors.loadFailed'));
    } finally {
      this.isLoading.set(false);
    }
  }

  tierName(tier: number): string {
    return this.i18n.t(`league.tier.${tier}`);
  }

  tierLabel(tier: number): string {
    return this.i18n.t('league.tierLabel').replace('{tier}', this.tierName(tier));
  }

  timeLeftLabel(weekEnd: string): string {
    const remaining = Math.max(0, new Date(weekEnd).getTime() - Date.now());
    const hours = Math.floor(remaining / HOUR_MS);
    return this.i18n
      .t('league.timeLeft')
      .replace('{d}', String(Math.floor(hours / 24)))
      .replace('{h}', String(hours % 24));
  }

  lastWeekMessage(league: League): string {
    const last = league.lastWeek;
    if (!last) {
      return '';
    }
    return this.i18n
      .t(`league.lastWeek.${last.result}`)
      .replace('{tier}', this.tierName(last.toTier))
      .replace('{rank}', String(last.rank))
      .replace('{size}', String(last.size));
  }

  hint(key: string, count: number): string {
    return this.i18n.t(key).replace('{n}', String(count));
  }

  openProfile(userId: string): void {
    void this.router.navigateByUrl(`/profile/${userId}`);
  }

  goBack(): void {
    void this.router.navigateByUrl('/tabs/progress');
  }
}
