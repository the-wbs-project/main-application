import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsModule, Store } from '@ngxs/store';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { PopupModule } from '@progress/kendo-angular-popup';
import {
  AnalyticsService,
  AppInitializerFactory,
  Messages,
  RequestInterceptor,
  Resources,
  ThemeService,
} from '@wbs/shared/services';
import {
  AuthState,
  MetadataState,
  OrganizationState,
  ProjectListState,
  UiState,
} from '@wbs/shared/states';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule,
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
    NotificationModule,
    PopupModule,
    ToastrModule.forRoot(),
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
      deps: [AnalyticsService, Messages],
      multi: true,
    },
  ],
})
export class AppModule {}
