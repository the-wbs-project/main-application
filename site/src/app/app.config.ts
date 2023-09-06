import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
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
import { routes } from './app.routes';
import {
  AppInitializerFactory,
  RequestInterceptor,
  Resources,
  ThemeService,
} from './core/services';
import { AUTH_CONFIG } from './globals.const';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom([
      AuthModule.forRoot(AUTH_CONFIG),
      BrowserAnimationsModule,
      HttpClientModule,
      NgxsLoggerPluginModule.forRoot({
        disabled: false, // environment.production,
      }),
      NgxsModule.forRoot([]),
      NgxsRouterPluginModule.forRoot(),
      TranslateModule.forRoot(),
    ]),
    provideRouter(routes, withComponentInputBinding()),
    {
      provide: APP_INITIALIZER,
      useFactory: AppInitializerFactory.run,
      deps: [Resources, ThemeService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
  ],
};
