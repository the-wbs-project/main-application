import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { BottomNavigationModule } from '@progress/kendo-angular-navigation';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { environment } from 'src/environments/environment';
import {
  FillElementDirective,
  FullscreenDirective,
  SidemenuToggleDirective,
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
  CategoryLabelPipe,
  DisciplineIconPipe,
  LengthPipe,
  ProjectListFilterLengthPipe,
  ProjectListFilterPipe,
} from '../pipes';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

@NgModule({
  imports: [
    BottomNavigationModule,
    FontAwesomeModule,
    FormsModule,
    NgbModule,
    NgxsLoggerPluginModule.forRoot({
      disabled: environment.production,
    }),
    NgxsRouterPluginModule.forRoot(),
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
    CategoryLabelPipe,
    ContentLayoutComponent,
    DisciplineIconPipe,
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
    SidemenuToggleDirective,
    TabToTopComponent,
    ToggleThemeDirective,
  ],
  exports: [
    CategoryLabelPipe,
    CommonModule,
    DisciplineIconPipe,
    FillElementDirective,
    FontAwesomeModule,
    NgbModule,
    PageHeaderComponent,
    TranslateModule,
  ],
})
export class SharedModule {}
