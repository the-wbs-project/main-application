import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { DropDownButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { BottomNavigationModule } from '@progress/kendo-angular-navigation';
import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
} from 'ngx-perfect-scrollbar';
import { LoadingComponent } from './components';
import {
  FillElementDirective,
  FullscreenDirective,
  MainContentDirective,
  MatchSizeDirective,
  ProgressBarDirective,
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
  MenuItemTitlePipe,
  ProjectListFilterLengthPipe,
  ProjectListFilterPipe,
  RolesTextPipe,
} from './pipes';
import { ServiceModule } from './services';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

@NgModule({
  imports: [
    BottomNavigationModule,
    DialogModule,
    DropDownButtonModule,
    FontAwesomeModule,
    FormsModule,
    NgbModule,
    PerfectScrollbarModule,
    RouterModule,
    ServiceModule,
    TranslateModule.forChild(),
  ],
  providers: [
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
    MainContentDirective,
    MatchSizeDirective,
    MenuItemTitlePipe,
    PageHeaderComponent,
    ProgressBarDirective,
    ProjectListFilterPipe,
    ProjectListFilterLengthPipe,
    RightSidebarComponent,
    RolesTextPipe,
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
    DropDownButtonModule,
    FillElementDirective,
    FontAwesomeModule,
    FormsModule,
    MainContentDirective,
    MatchSizeDirective,
    MenuItemTitlePipe,
    NgbModule,
    PageHeaderComponent,
    ProgressBarDirective,
    RolesTextPipe,
    ServiceModule,
    TranslateModule,
  ],
})
export class SharedModule {}
