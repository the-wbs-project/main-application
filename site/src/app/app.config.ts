import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  HttpClientXsrfModule,
} from '@angular/common/http';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  ErrorHandler,
  importProvidersFrom,
} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { routes } from './app.routes';
import { UiStore } from './core/store';
import {
  AppInitializerFactory,
  ApiRequestInterceptor,
  GlobalErrorHandler,
} from './setup';
import { APP_CONFIG_TOKEN, AppConfiguration } from './core/models';

const config: AppConfiguration = (window as any)['appConfig'];
const apiDomain = config.api_domain;

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: APP_CONFIG_TOKEN, useValue: config },
    importProvidersFrom([
      BrowserAnimationsModule,
      HttpClientModule,
      HttpClientXsrfModule.withOptions({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
      }),
      NgxsLoggerPluginModule.forRoot({
        disabled: true, // environment.production,
      }),
      NgxsModule.forRoot([]),
      NgxsRouterPluginModule.forRoot(),
      TranslateModule.forRoot(),
      AuthModule.forRoot({
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
            { uri: apiDomain + '/api/resources/*', allowAnonymous: true },
            { uri: apiDomain + '/api/lists/*', allowAnonymous: true },
            'https://ai.pm-empower.com/*',
            apiDomain + '/*',
          ],
        },
      }),
    ]),
    provideRouter(routes, withComponentInputBinding()),
    {
      provide: APP_INITIALIZER,
      useFactory: AppInitializerFactory.run,
      deps: [UiStore],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiRequestInterceptor,
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
};
