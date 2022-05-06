import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { BottomNavigationModule } from '@progress/kendo-angular-navigation';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { LoadingComponent } from './components';
import {
  FillElementDirective,
  FullscreenDirective,
  SidemenuToggleDirective,
  ToggleThemeDirective,
} from './directives';
import {
  ContentLayoutComponent,
  FooterComponent,
  HeaderComponent,
  LoaderComponent,
  PageHeaderComponent,
  RightSidebarComponent,
  SidebarComponent,
  TabToTopComponent,
} from './layout';
import {
  CategoryIdConverterPipe,
  CategoryLabelPipe,
  DisciplineIconPipe,
  LengthPipe,
  ProjectListFilterLengthPipe,
  ProjectListFilterPipe,
} from './pipes';
import { LoadingService } from './services';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

@NgModule({
  imports: [
    BottomNavigationModule,
    DialogModule,
    FontAwesomeModule,
    FormsModule,
    NgbModule,
    PerfectScrollbarModule,
    RouterModule,
    TranslateModule.forChild(),
  ],
  providers: [
    LoadingService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
  ],
  declarations: [
    CategoryIdConverterPipe,
    CategoryLabelPipe,
    ContentLayoutComponent,
    DisciplineIconPipe,
    FillElementDirective,
    FooterComponent,
    FullscreenDirective,
    HeaderComponent,
    LengthPipe,
    LoaderComponent,
    LoadingComponent,
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
    CategoryIdConverterPipe,
    CategoryLabelPipe,
    CommonModule,
    DialogModule,
    DisciplineIconPipe,
    FillElementDirective,
    FontAwesomeModule,
    FormsModule,
    NgbModule,
    PageHeaderComponent,
    TranslateModule,
  ],
})
export class SharedModule {}
