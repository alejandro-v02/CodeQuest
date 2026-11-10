import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent, IonIcon, IonModal, IonSpinner, IonTextarea } from '@ionic/angular';
import { AuthService } from '../../../../core/services/auth.service';
import { SocialService } from '../../../../core/services/social.service';
import type { CommentDto } from '../../../../core/models/social.model';
import { LoadingBounceComponent } from '../../../../shared/components/loading-bounce/loading-bounce.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-comments-sheet',
  templateUrl: './comments-sheet.component.html',
  styleUrls: ['./comments-sheet.component.scss'],
  imports: [
    FormsModule,
    IonButton,
    IonContent,
    IonIcon,
    IonModal,
    IonSpinner,
    IonTextarea,
    LoadingBounceComponent,
    EmptyStateComponent,
  ],
})
export class CommentsSheetComponent {
  private readonly authService = inject(AuthService);
  private readonly socialService = inject(SocialService);

  readonly isOpen = input.required<boolean>();
  readonly postId = input.required<string>();
  readonly closed = output<void>();
  readonly countChanged = output<number>();

  readonly comments = signal<CommentDto[]>([]);
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly draft = signal('');
  readonly isSending = signal(false);

  readonly myUserId = () => this.authService.currentUser()?.id ?? null;

  async onWillPresent(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    try {
      this.comments.set(await this.socialService.getComments(this.postId()));
    } catch {
      this.errorMessage.set('No se pudieron cargar los comentarios.');
    } finally {
      this.isLoading.set(false);
    }
  }

  dismiss(): void {
    this.draft.set('');
    this.closed.emit();
  }

  async send(): Promise<void> {
    const body = this.draft().trim();
    if (!body || this.isSending()) {
      return;
    }

    this.isSending.set(true);
    try {
      const comment = await this.socialService.addComment(this.postId(), body);
      this.comments.update((list) => [...list, comment]);
      this.draft.set('');
      this.countChanged.emit(this.comments().length);
    } catch {
      this.errorMessage.set('No se pudo enviar el comentario.');
    } finally {
      this.isSending.set(false);
    }
  }

  async remove(comment: CommentDto): Promise<void> {
    try {
      await this.socialService.deleteComment(comment.id);
      this.comments.update((list) => list.filter((c) => c.id !== comment.id));
      this.countChanged.emit(this.comments().length);
    } catch {
      this.errorMessage.set('No se pudo borrar el comentario.');
    }
  }
}
