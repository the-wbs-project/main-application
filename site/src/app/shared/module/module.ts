import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsModule } from '@ngxs/store';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { environment } from 'src/environments/environment';
import {
  FillElementDirective,
  FullscreenDirective,
  ToggleThemeDirective,
} from '../directives';
import {
  ContentLayoutComponent,
  FooterComponent,
  HeaderComponent,
  LoaderComponent,
  PageHeaderComponent,
  RightSidebarComponent,
  SidebarComponent,
  TabToTopComponent,
} from '../layout';
import {
  LengthPipe,
  ProjectListFilterLengthPipe,
  ProjectListFilterPipe,
} from '../pipes';
import { AuthState, MetadataState, ProjectState } from '../states';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

@NgModule({
  imports: [
    FontAwesomeModule,
    FormsModule,
    NgbModule,
    NgxsModule.forRoot([AuthState, MetadataState, ProjectState]),
    NgxsLoggerPluginModule.forRoot({
      disabled: environment.production,
    }),
    PerfectScrollbarModule,
    RouterModule,
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
  ],
  declarations: [
    ContentLayoutComponent,
    FillElementDirective,
    FooterComponent,
    FullscreenDirective,
    HeaderComponent,
    LengthPipe,
    LoaderComponent,
    PageHeaderComponent,
    ProjectListFilterPipe,
    ProjectListFilterLengthPipe,
    RightSidebarComponent,
    SidebarComponent,
    TabToTopComponent,
    ToggleThemeDirective,
  ],
  exports: [FillElementDirective, PageHeaderComponent],
})
export class SharedModule {}
