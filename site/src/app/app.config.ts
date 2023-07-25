import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { NgxsModule, Store } from '@ngxs/store';
import { TranslateModule } from '@ngx-translate/core';
import { AppInitializerFactory, RequestInterceptor, Resources, ThemeService } from './core/services';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { AUTH_CONFIG } from './globals.const';
import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { environment } from 'src/environments/environment';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { PopupModule } from '@progress/kendo-angular-popup';
import { SortableModule } from '@progress/kendo-angular-sortable';
import { AuthState, MetadataState, OrganizationState, UiState } from './core/states';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom([
      AuthModule.forRoot(AUTH_CONFIG),
      DialogModule,
      HttpClientModule,
      NgxsLoggerPluginModule.forRoot({
        disabled: environment.production,
      }),
      NgxsModule.forRoot([AuthState, MetadataState, OrganizationState, UiState]),
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
