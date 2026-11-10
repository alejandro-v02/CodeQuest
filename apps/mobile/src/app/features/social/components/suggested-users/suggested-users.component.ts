import { Component, OnInit, inject, signal } from '@angular/core';
import { SocialService } from '../../../../core/services/social.service';
import type { UserResult } from '../../../../core/models/social.model';
import { UserResultRowComponent } from '../user-result-row/user-result-row.component';

@Component({
  selector: 'app-suggested-users',
  templateUrl: './suggested-users.component.html',
  styleUrls: ['./suggested-users.component.scss'],
  imports: [UserResultRowComponent],
})
export class SuggestedUsersComponent implements OnInit {
  private readonly socialService = inject(SocialService);

  readonly suggestions = signal<UserResult[]>([]);

  async ngOnInit(): Promise<void> {
    try {
      this.suggestions.set(await this.socialService.getSuggestions());
    } catch {
      this.suggestions.set([]);
    }
  }

  onChanged(updated: UserResult): void {
    this.suggestions.update((list) =>
      list.map((u) => (u.userId === updated.userId ? updated : u)),
    );
  }
}
