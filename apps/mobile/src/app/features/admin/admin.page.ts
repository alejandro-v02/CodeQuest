import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonContent, ViewWillEnter } from '@ionic/angular';
import { AdminService } from '../../core/services/admin.service';
import type { AdminExerciseStat } from '../../core/models/admin.model';
import { LoadingBounceComponent } from '../../shared/components/loading-bounce/loading-bounce.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { I18nService } from '../../core/services/i18n.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

interface AdminLanguageGroup {
  languageSlug: string;
  languageName: string;
  concepts: AdminExerciseStat[];
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  imports: [IonButton, IonContent, LoadingBounceComponent, PageHeaderComponent, TranslatePipe],
})
export class AdminPage implements ViewWillEnter {
  private readonly adminService = inject(AdminService);
  private readonly router = inject(Router);
  private readonly i18n = inject(I18nService);

  readonly groups = signal<AdminLanguageGroup[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  ionViewWillEnter(): void {
    void this.loadStats();
  }

  async loadStats(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const stats = await this.adminService.getStats();
      this.groups.set(this.groupByLanguage(stats));
    } catch {
      this.errorMessage.set(this.i18n.t('admin.errors.loadFailed'));
    } finally {
      this.isLoading.set(false);
    }
  }

  private groupByLanguage(stats: AdminExerciseStat[]): AdminLanguageGroup[] {
    const byLanguage = new Map<string, AdminLanguageGroup>();
    for (const stat of stats) {
      let group = byLanguage.get(stat.languageSlug);
      if (!group) {
        group = {
          languageSlug: stat.languageSlug,
          languageName: stat.languageName,
          concepts: [],
        };
        byLanguage.set(stat.languageSlug, group);
      }
      group.concepts.push(stat);
    }
    return [...byLanguage.values()];
  }

  goBack(): void {
    void this.router.navigateByUrl('/tabs/profile');
  }
}
