import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonModal, IonSpinner, IonTextarea } from '@ionic/angular';
import { SocialService } from '../../../../core/services/social.service';
import type { PostDto } from '../../../../core/models/social.model';

@Component({
  selector: 'app-compose-post-sheet',
  templateUrl: './compose-post-sheet.component.html',
  styleUrls: ['./compose-post-sheet.component.scss'],
  imports: [FormsModule, IonButton, IonModal, IonSpinner, IonTextarea],
})
export class ComposePostSheetComponent {
  private readonly socialService = inject(SocialService);

  readonly isOpen = input.required<boolean>();
  readonly closed = output<void>();
  readonly posted = output<PostDto>();

  readonly body = signal('');
  readonly isSending = signal(false);
  readonly errorMessage = signal<string | null>(null);

  dismiss(): void {
    this.body.set('');
    this.errorMessage.set(null);
    this.closed.emit();
  }

  async publish(): Promise<void> {
    const text = this.body().trim();
    if (!text || this.isSending()) {
      return;
    }

    this.isSending.set(true);
    this.errorMessage.set(null);
    try {
      const post = await this.socialService.createPost({ type: 'text', body: text });
      this.posted.emit(post);
      this.dismiss();
    } catch {
      this.errorMessage.set('No se pudo publicar. Intenta de nuevo.');
    } finally {
      this.isSending.set(false);
    }
  }
}
