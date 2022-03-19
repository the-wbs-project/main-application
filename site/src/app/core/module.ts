import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import {
  ButtonGroupModule,
  ButtonModule,
} from '@progress/kendo-angular-buttons';
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
import { AuthState, MetadataState, ProjectState } from '../states';
import { NavbarComponent } from './components';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ButtonGroupModule,
    ButtonModule,
    CommonModule,
    DialogModule,
    DrawerModule,
    HttpClientModule,
    IconModule,
    NgxsModule.forRoot([AuthState, MetadataState, ProjectState]),
    NgxsLoggerPluginModule.forRoot({
      disabled: environment.production,
    }),
    NgxsRouterPluginModule.forRoot(),
    NotificationModule,
    ToastrModule.forRoot(),
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
  declarations: [NavbarComponent],
  exports: [
    ButtonGroupModule,
    ButtonModule,
    CommonModule,
    DrawerModule,
    IconModule,
    NavbarComponent,
  ],
})
export class CoreModule {}
