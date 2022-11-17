import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsModule, Store } from '@ngxs/store';
import {
  AnalyticsService,
  AppInitializerFactory,
  Messages,
  RequestInterceptor,
  Resources,
  ThemeService,
} from '@wbs/core/services';
import {
  AuthState,
  MetadataState,
  OrganizationState,
  ProjectListState,
  UiState,
} from '@wbs/core/states';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxsLoggerPluginModule.forRoot({
      disabled: false, // environment.production,
    }),
    NgxsModule.forRoot([
      AuthState,
      MetadataState,
      OrganizationState,
      ProjectListState,
      UiState,
    ]),
    NgxsRouterPluginModule.forRoot(),
    TranslateModule.forRoot(),
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: AppInitializerFactory.run,
      deps: [Store, Resources, ThemeService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      deps: [AnalyticsService, Messages, Store],
      multi: true,
    },
  ],
})
export class AppModule {}
