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
import {
  ActionButtonsComponent,
  EditPencilComponent,
  LoadingComponent,
} from './components';
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
  SidebarComponent,
  TabToTopComponent,
} from './layout';
import {
  CategoryIdConverterPipe,
  CategoryLabelPipe,
  DateTextPipe,
  DisciplineIconPipe,
  LengthPipe,
  ProjectListFilterLengthPipe,
  ProjectListFilterPipe,
  ProjectStatusCountPipe,
  ProjectStatusPipe,
  RolesListPipe,
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
    ActionButtonsComponent,
    CategoryIdConverterPipe,
    CategoryLabelPipe,
    ContentLayoutComponent,
    DateTextPipe,
    DisciplineIconPipe,
    EditPencilComponent,
    FillElementDirective,
    FooterComponent,
    FullscreenDirective,
    HeaderComponent,
    LengthPipe,
    LoaderComponent,
    LoadingComponent,
    MainContentDirective,
    MatchSizeDirective,
    PageHeaderComponent,
    ProgressBarDirective,
    ProjectListFilterPipe,
    ProjectListFilterLengthPipe,
    ProjectStatusCountPipe,
    ProjectStatusPipe,
    RolesListPipe,
    SidebarComponent,
    SidemenuToggleDirective,
    TabToTopComponent,
    ToggleThemeDirective,
  ],
  exports: [
    ActionButtonsComponent,
    CategoryIdConverterPipe,
    CategoryLabelPipe,
    CommonModule,
    DateTextPipe,
    DialogModule,
    DisciplineIconPipe,
    DropDownButtonModule,
    EditPencilComponent,
    FillElementDirective,
    FontAwesomeModule,
    FormsModule,
    MainContentDirective,
    MatchSizeDirective,
    NgbModule,
    PageHeaderComponent,
    ProgressBarDirective,
    ProjectStatusCountPipe,
    ProjectStatusPipe,
    RolesListPipe,
    ServiceModule,
    TranslateModule,
  ],
})
export class SharedModule {}
