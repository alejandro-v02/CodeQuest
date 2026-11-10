import { Component, inject, input, output, signal } from '@angular/core';
import { IonIcon } from '@ionic/angular';
import { SocialService } from '../../../../core/services/social.service';
import type { ReactionIcon, ReactionSummary } from '../../../../core/models/social.model';

interface ReactionOption {
  icon: ReactionIcon;
  label: string;
}

const REACTION_OPTIONS: ReactionOption[] = [
  { icon: 'flame', label: 'Fuego' },
  { icon: 'flash', label: 'Chispa' },
  { icon: 'rocket', label: 'Cohete' },
  { icon: 'thumbs_up', label: 'Me gusta' },
];

@Component({
  selector: 'app-reaction-bar',
  templateUrl: './reaction-bar.component.html',
  styleUrls: ['./reaction-bar.component.scss'],
  imports: [IonIcon],
})
export class ReactionBarComponent {
  private readonly socialService = inject(SocialService);

  readonly postId = input.required<string>();
  readonly reactions = input.required<ReactionSummary>();
  readonly changed = output<ReactionSummary>();

  readonly options = REACTION_OPTIONS;
  readonly poppingIcon = signal<ReactionIcon | null>(null);
  readonly isSending = signal(false);

  iconName(icon: ReactionIcon): string {
    return icon === 'thumbs_up' ? 'thumbs-up' : icon;
  }

  count(icon: ReactionIcon): number {
    return this.reactions().counts[icon] ?? 0;
  }

  async toggle(icon: ReactionIcon): Promise<void> {
    if (this.isSending()) {
      return;
    }
    const current = this.reactions();
    const wasMine = current.myReaction === icon;

    this.poppingIcon.set(icon);
    this.isSending.set(true);

    const optimistic = this.applyOptimistic(current, icon, wasMine);
    this.changed.emit(optimistic);

    try {
      if (wasMine) {
        await this.socialService.removeReaction(this.postId());
      } else {
        await this.socialService.setReaction(this.postId(), icon);
      }
    } catch {
      // Revert on failure — the optimistic update above was wrong.
      this.changed.emit(current);
    } finally {
      this.isSending.set(false);
    }
  }

  clearPop(): void {
    this.poppingIcon.set(null);
  }

  private applyOptimistic(
    current: ReactionSummary,
    icon: ReactionIcon,
    wasMine: boolean,
  ): ReactionSummary {
    const counts = { ...current.counts };
    if (current.myReaction) {
      counts[current.myReaction] = Math.max(0, counts[current.myReaction] - 1);
    }
    if (!wasMine) {
      counts[icon] = (counts[icon] ?? 0) + 1;
    }
    return { counts, myReaction: wasMine ? null : icon };
  }
}
