import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  ErrorHandler,
  importProvidersFrom,
} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { authHttpInterceptorFn, provideAuth0 } from '@auth0/auth0-angular';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { environment } from 'src/env';
import { routes } from './app.routes';
import { DataServiceFactory } from './core/data-services';
import { Resources } from './core/services';
import { MetadataStore, UiStore } from './core/store';
import { AppInitializerFactory, GlobalErrorHandler } from './setup';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authHttpInterceptorFn])),
    provideRouter(routes, withComponentInputBinding()),
    provideAuth0({
      domain: 'auth.pm-empower.com',
      clientId: environment.authClientId,
      authorizationParams: {
        connection: 'Username-Password-Authentication',
        audience: 'https://pm-empower.us.auth0.com/api/v2/',
        redirect_uri: environment.authRedirectUri,
      },
      // The AuthHttpInterceptor configuration
      httpInterceptor: {
        allowedList: [
          { uri: 'api/*', allowAnonymous: false },
          { uri: 'https://ai.pm-empower.com/*', allowAnonymous: false },
        ],
      },
    }),
    importProvidersFrom([
      BrowserAnimationsModule,
      NgxsLoggerPluginModule.forRoot({
        disabled: true, // environment.production,
      }),
      NgxsModule.forRoot([]),
      NgxsRouterPluginModule.forRoot(),
      TranslateModule.forRoot(),
    ]),
    {
      provide: APP_INITIALIZER,
      useFactory: AppInitializerFactory.run,
      deps: [DataServiceFactory, MetadataStore, Resources, UiStore],
      multi: true,
    },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
};
