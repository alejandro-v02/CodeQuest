import { Component, inject, input, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonIcon, IonSpinner } from '@ionic/angular';
import { SocialService } from '../../../../core/services/social.service';
import type { UserResult } from '../../../../core/models/social.model';

@Component({
  selector: 'app-user-result-row',
  templateUrl: './user-result-row.component.html',
  styleUrls: ['./user-result-row.component.scss'],
  imports: [IonIcon, IonSpinner],
})
export class UserResultRowComponent {
  private readonly router = inject(Router);
  private readonly socialService = inject(SocialService);

  readonly user = input.required<UserResult>();
  readonly variant = input<'row' | 'card'>('row');
  readonly changed = output<UserResult>();

  readonly isBusy = signal(false);

  openProfile(): void {
    void this.router.navigateByUrl(`/profile/${this.user().userId}`);
  }

  async toggleFollow(event: Event): Promise<void> {
    event.stopPropagation();
    if (this.isBusy()) {
      return;
    }
    const current = this.user();
    this.isBusy.set(true);
    try {
      if (current.isFollowedByMe) {
        await this.socialService.unfollow(current.userId);
      } else {
        await this.socialService.follow(current.userId);
      }
      this.changed.emit({ ...current, isFollowedByMe: !current.isFollowedByMe });
    } finally {
      this.isBusy.set(false);
    }
  }
}
