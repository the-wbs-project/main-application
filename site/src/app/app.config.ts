import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { PopupModule } from '@progress/kendo-angular-popup';
import { SortableModule } from '@progress/kendo-angular-sortable';
import { environment } from 'src/environments/environment';
import { routes } from './app.routes';
import {
  AppInitializerFactory,
  RequestInterceptor,
  Resources,
  ThemeService,
} from './core/services';
import {
  AuthState,
  MetadataState,
  OrganizationState,
  UiState,
} from './core/states';
import { AUTH_CONFIG } from './globals.const';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom([
      AuthModule.forRoot(AUTH_CONFIG),
      BrowserAnimationsModule,
      DialogModule,
      HttpClientModule,
      NgxsLoggerPluginModule.forRoot({
        disabled: false, // environment.production,
      }),
      NgxsModule.forRoot([
        AuthState,
        MetadataState,
        OrganizationState,
        UiState,
      ]),
      NgxsRouterPluginModule.forRoot(),
      PopupModule,
      SortableModule,
      TranslateModule.forRoot(),
    ]),
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      useFactory: AppInitializerFactory.run,
      deps: [Store, Resources, ThemeService],
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
