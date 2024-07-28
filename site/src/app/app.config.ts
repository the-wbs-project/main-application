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
import { routes } from './app.routes';
import { UiStore } from './core/store';
import { APP_CONFIG_TOKEN, AppConfiguration } from './core/models';
import {
  AppInitializerFactory,
  GlobalErrorHandler,
  apiRequestInterceptor,
} from './setup';

const config: AppConfiguration = (window as any)['appConfig'];

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: APP_CONFIG_TOKEN, useValue: config },
    provideHttpClient(
      withInterceptors([apiRequestInterceptor, authHttpInterceptorFn])
    ),
    provideRouter(routes, withComponentInputBinding()),
    provideAuth0({
      domain: 'auth.pm-empower.com',
      clientId: config.auth_clientId,
      authorizationParams: {
        connection: 'Username-Password-Authentication',
        audience: 'https://pm-empower.us.auth0.com/api/v2/',
        redirect_uri: `${window.location.protocol}//${window.location.host}`,
      },
      // The AuthHttpInterceptor configuration
      httpInterceptor: {
        allowedList: [
          //{ uri: apiDomain + '/api/resources/*', allowAnonymous: true },
          //{ uri: apiDomain + '/api/lists/*', allowAnonymous: true },
          { uri: 'http://localhost:88/*', allowAnonymous: false },
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
      deps: [UiStore],
      multi: true,
    },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
};
