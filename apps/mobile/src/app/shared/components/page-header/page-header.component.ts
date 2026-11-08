import { Component, input, output } from '@angular/core';
import { IonHeader, IonToolbar, IonButtons, IonButton, IonIcon } from '@ionic/angular';

// Shared replacement for the plain <ion-header><ion-toolbar><ion-title>
// markup every page used to duplicate. Keeps ion-header/ion-toolbar (so
// Ionic's own layout + safe-area handling still pushes ion-content down
// correctly) but reskins the toolbar as a frosted glass bar with a bigger
// title, matching the floating-glass tab bar at the bottom of the app.
@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  imports: [IonHeader, IonToolbar, IonButtons, IonButton, IonIcon],
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly eyebrow = input<string | null>(null);
  readonly showBack = input(false);

  readonly back = output<void>();
}
