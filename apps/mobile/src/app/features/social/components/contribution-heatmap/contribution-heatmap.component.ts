import { Component, computed, input } from '@angular/core';
import type { HeatmapDay } from '../../../../core/models/social.model';

interface HeatmapCell {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

const DAYS_BACK = 364;

@Component({
  selector: 'app-contribution-heatmap',
  templateUrl: './contribution-heatmap.component.html',
  styleUrls: ['./contribution-heatmap.component.scss'],
})
export class ContributionHeatmapComponent {
  readonly heatmapDays = input.required<HeatmapDay[]>();

  readonly cells = computed<HeatmapCell[]>(() => {
    const byDate = new Map(this.heatmapDays().map((d) => [d.date.slice(0, 10), d.count]));
    const maxCount = Math.max(1, ...this.heatmapDays().map((d) => d.count));

    const cells: HeatmapCell[] = [];
    const today = new Date();
    for (let i = DAYS_BACK; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const key = date.toISOString().slice(0, 10);
      const count = byDate.get(key) ?? 0;
      cells.push({ date: key, count, level: this.levelFor(count, maxCount) });
    }
    return cells;
  });

  readonly weeks = computed<HeatmapCell[][]>(() => {
    const cells = this.cells();
    const weeks: HeatmapCell[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      weeks.push(cells.slice(i, i + 7));
    }
    return weeks;
  });

  private levelFor(count: number, maxCount: number): 0 | 1 | 2 | 3 | 4 {
    if (count === 0) {
      return 0;
    }
    const ratio = count / maxCount;
    if (ratio <= 0.25) return 1;
    if (ratio <= 0.5) return 2;
    if (ratio <= 0.75) return 3;
    return 4;
  }
}
