import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

// By default the webview stops below the status bar, so CSS can't draw
// anything "inside" it. Enabled once, globally, at app boot (app.component.ts)
// so every page's glass header/fade can show through behind the status bar
// icons instead of stopping below them.
@Injectable({ providedIn: 'root' })
export class StatusBarService {
  async enableOverlay(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    await StatusBar.setOverlaysWebView({ overlay: true });
    await StatusBar.setStyle({ style: Style.Dark });
    if (Capacitor.getPlatform() === 'android') {
      await StatusBar.setBackgroundColor({ color: '#00000000' });
    }
  }
}
