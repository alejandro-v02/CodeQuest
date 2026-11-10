import { Component, inject, input, output, signal } from '@angular/core';
import { IonIcon } from '@ionic/angular';
import { SocialService } from '../../../../core/services/social.service';
import type { ReactionIcon, ReactionSummary } from '../../../../core/models/social.model';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

interface ReactionOption {
  icon: ReactionIcon;
  labelKey: string;
}

const REACTION_OPTIONS: ReactionOption[] = [
  { icon: 'flame', labelKey: 'reaction.flame' },
  { icon: 'flash', labelKey: 'reaction.flash' },
  { icon: 'rocket', labelKey: 'reaction.rocket' },
  { icon: 'thumbs_up', labelKey: 'reaction.thumbsUp' },
];

@Component({
  selector: 'app-reaction-bar',
  templateUrl: './reaction-bar.component.html',
  styleUrls: ['./reaction-bar.component.scss'],
  imports: [IonIcon, TranslatePipe],
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
