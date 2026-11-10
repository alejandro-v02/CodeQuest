import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { AuthService } from './core/services/auth.service';
import { DeepLinkService } from './core/services/deep-link.service';
import { I18nService } from './core/services/i18n.service';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({}),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    // Blocks first render until we know whether there's a valid session, so
    // route guards never have to handle an "auth state unknown yet" case.
    provideAppInitializer(() => inject(AuthService).restoreSession()),
    // Registers the codequest:// listener for the GitHub OAuth callback.
    provideAppInitializer(() => inject(DeepLinkService).init()),
    // Loads both dictionaries and the saved language before first render,
    // so no page ever flashes untranslated text.
    provideAppInitializer(() => inject(I18nService).init()),
  ],
};
