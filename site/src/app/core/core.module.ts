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
import { IconModule } from '@progress/kendo-angular-icons';
import { DrawerModule } from '@progress/kendo-angular-layout';
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
import { NavbarComponent } from './components';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ButtonModule,
    CommonModule,
    DrawerModule,
    HttpClientModule,
    IconModule,
    NgxsModule.forRoot([AuthState, ProjectState]),
    NgxsLoggerPluginModule.forRoot({
      disabled: environment.production,
    }),
    NgxsRouterPluginModule.forRoot(),
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
