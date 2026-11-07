import { Component, signal } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';
import { BootScreenComponent } from './core/boot/boot-screen.component';

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
}
