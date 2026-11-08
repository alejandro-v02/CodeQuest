import { Component, inject, signal } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';
import { BootScreenComponent } from './core/boot/boot-screen.component';
import { StatusBarService } from './core/services/status-bar.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonApp, IonRouterOutlet, BootScreenComponent],
})
export class AppComponent {
  // The router outlet renders underneath from the start (session restore
  // already finished before bootstrap — see provideAppInitializer in
  // app.config.ts), so removing the boot overlay never reveals a "loading"
  // app underneath; it just stops covering the one that's already ready.
  readonly showBoot = signal(true);

  constructor() {
    // Overlay mode used to be toggled per-page (auth only); now every page
    // has a glass header/tab bar designed to sit under the status bar, so
    // it's turned on once for the whole app instead.
    void inject(StatusBarService).enableOverlay();
  }
}
