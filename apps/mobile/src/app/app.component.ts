import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular';
import { filter } from 'rxjs';
import { BootScreenComponent } from './core/boot/boot-screen.component';
import { AnalyticsService, normalizeScreen } from './core/services/analytics.service';
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

    const analytics = inject(AnalyticsService);
    analytics.track('app_open');
    inject(Router)
      .events.pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) =>
        analytics.track('screen_view', { screen: normalizeScreen(event.urlAfterRedirects) }),
      );
  }
}
