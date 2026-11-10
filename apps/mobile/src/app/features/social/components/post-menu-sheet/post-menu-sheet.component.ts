import { Component, input, output } from '@angular/core';
import { IonIcon, IonModal } from '@ionic/angular';
import type { SocialReportReason } from '../../../../core/models/social.model';

const REPORT_REASONS: { reason: SocialReportReason; label: string }[] = [
  { reason: 'spam', label: 'Es spam' },
  { reason: 'offensive', label: 'Contenido ofensivo' },
  { reason: 'harassment', label: 'Acoso' },
  { reason: 'other', label: 'Otro motivo' },
];

@Component({
  selector: 'app-post-menu-sheet',
  templateUrl: './post-menu-sheet.component.html',
  styleUrls: ['./post-menu-sheet.component.scss'],
  imports: [IonIcon, IonModal],
})
export class PostMenuSheetComponent {
  readonly isOpen = input.required<boolean>();
  readonly isMine = input.required<boolean>();

  readonly closed = output<void>();
  readonly deleteRequested = output<void>();
  readonly reportRequested = output<SocialReportReason>();

  readonly reportReasons = REPORT_REASONS;

  dismiss(): void {
    this.closed.emit();
  }

  requestDelete(): void {
    this.deleteRequested.emit();
  }

  requestReport(reason: SocialReportReason): void {
    this.reportRequested.emit(reason);
  }
}
