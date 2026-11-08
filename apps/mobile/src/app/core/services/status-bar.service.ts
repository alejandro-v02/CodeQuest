import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

// By default the webview stops below the status bar, so CSS can't draw
// anything "inside" it. The auth pages want their top fade-out gradient to
// actually show through behind the status bar icons, so they toggle overlay
// mode on enter/leave instead of flipping it for the whole app — scoped to
// where it's needed, so other pages keep their current (non-overlay) layout.
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

  async disableOverlay(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    await StatusBar.setOverlaysWebView({ overlay: false });
  }
}
