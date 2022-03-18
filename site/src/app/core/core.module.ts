import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { IconModule } from '@progress/kendo-angular-icons';
import { DrawerModule } from '@progress/kendo-angular-layout';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { ToastrModule } from 'ngx-toastr';
import { environment } from '../../environments/environment';
import {
  AnalyticsService,
  AppInitializerFactory,
  Messages,
  RequestInterceptor,
  Resources,
  StartupService,
} from '../services';
import {
  LengthPipe,
  ProjectListFilterLengthPipe,
  ProjectListFilterPipe,
} from './pipes';
import { AuthState, ProjectState } from '../states';
import { DirectivesModule } from './directives';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ButtonModule,
    CommonModule,
    DialogModule,
    DirectivesModule,
    DrawerModule,
    HttpClientModule,
    IconModule,
    NgxsModule.forRoot([AuthState, ProjectState]),
    NgxsLoggerPluginModule.forRoot({
      disabled: environment.production,
    }),
    NgxsRouterPluginModule.forRoot(),
    NotificationModule,
    ToastrModule.forRoot(),
    TranslateModule.forRoot(),
  ],
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
      deps: [Resources, StartupService],
      multi: true,
    },
  ],
  declarations: [
    LengthPipe,
    ProjectListFilterPipe,
    ProjectListFilterLengthPipe,
  ],
  exports: [ButtonModule, DrawerModule, IconModule],
})
export class CoreModule {}
