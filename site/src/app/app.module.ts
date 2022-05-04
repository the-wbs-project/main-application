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
import {
  AnalyticsService,
  AppInitializerFactory,
  DataServiceFactory,
  Messages,
  RequestInterceptor,
  Resources,
  StartupService,
  ThemeService,
} from '@wbs/shared/services';
import { AuthState, MetadataState } from '@wbs/shared/states';
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
    NgxsModule.forRoot([AuthState, MetadataState]),
    NgxsRouterPluginModule.forRoot(),
    NotificationModule,
    ToastrModule.forRoot(),
    TranslateModule.forRoot(),
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      deps: [AnalyticsService, Messages],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: AppInitializerFactory.run,
      deps: [
        Store,
        DataServiceFactory,
        Resources,
        StartupService,
        ThemeService,
      ],
      multi: true,
    },
  ],
})
export class AppModule {}
