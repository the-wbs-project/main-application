import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  HttpClientXsrfModule,
} from '@angular/common/http';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { AUTH_CONFIG } from 'src/environments/auth.config';
import { routes } from './app.routes';
import { Resources } from './core/services';
import { AppInitializerFactory, ApiRequestInterceptor } from './setup';
import { AiStore, UiStore } from './core/store';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom([
      AuthModule.forRoot(AUTH_CONFIG),
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
    ]),
    provideRouter(routes, withComponentInputBinding()),
    {
      provide: APP_INITIALIZER,
      useFactory: AppInitializerFactory.run,
      deps: [Resources, UiStore, AiStore],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiRequestInterceptor,
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
  ],
};
