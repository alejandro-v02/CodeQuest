import { Component, OnInit, inject, signal } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { I18nService } from '../../../core/services/i18n.service';
import type { AnalyticsSummary, Retention } from '../../../core/models/analytics.model';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

// Product metrics for the people listed in the server's ADMIN_EMAILS. Anyone
// else gets a 403, and the whole section simply doesn't render.
@Component({
  selector: 'app-analytics-summary',
  templateUrl: './analytics-summary.component.html',
  styleUrls: ['./analytics-summary.component.scss'],
  imports: [TranslatePipe],
})
export class AnalyticsSummaryComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly i18n = inject(I18nService);

  readonly summary = signal<AnalyticsSummary | null>(null);

  async ngOnInit(): Promise<void> {
    try {
      this.summary.set(await this.adminService.getAnalyticsSummary());
    } catch {
      this.summary.set(null);
    }
  }

  retentionLabel(item: Retention): string {
    return item.rate === null ? '—' : `${item.rate}%`;
  }

  retentionDetail(item: Retention): string {
    return this.i18n
      .t('admin.analytics.retentionDetail')
      .replace('{returned}', String(item.returned))
      .replace('{eligible}', String(item.eligible));
  }

  retentionDay(item: Retention): string {
    return this.i18n.t('admin.analytics.retentionDay').replace('{n}', String(item.day));
  }
}
