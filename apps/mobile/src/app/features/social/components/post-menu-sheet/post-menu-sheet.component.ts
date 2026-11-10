import { Component, input, output } from '@angular/core';
import { IonIcon, IonModal } from '@ionic/angular';
import type { SocialReportReason } from '../../../../core/models/social.model';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

const REPORT_REASONS: { reason: SocialReportReason; labelKey: string }[] = [
  { reason: 'spam', labelKey: 'postMenu.spam' },
  { reason: 'offensive', labelKey: 'postMenu.offensive' },
  { reason: 'harassment', labelKey: 'postMenu.harassment' },
  { reason: 'other', labelKey: 'postMenu.other' },
];

@Component({
  selector: 'app-post-menu-sheet',
  templateUrl: './post-menu-sheet.component.html',
  styleUrls: ['./post-menu-sheet.component.scss'],
  imports: [IonIcon, IonModal, TranslatePipe],
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
