import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
} from 'ngx-perfect-scrollbar';
import {
  ActionButtonsComponent,
  EditPencilComponent,
  LoadingComponent,
  SwitchComponent,
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
  PageHeaderComponent,
  SidebarComponent,
  TabToTopComponent,
} from './layout';
import {
  CategoryIconPipe,
  CategoryIdConverterPipe,
  CategoryLabelPipe,
  DateTextPipe,
  DisciplineIconPipe,
  EditedDateTextPipe,
  LengthPipe,
  ProjectListFilterLengthPipe,
  ProjectListFilterPipe,
  ProjectStatusCountPipe,
  ProjectStatusPipe,
  RolesListPipe,
  SafeHtmlPipe,
  UserNamePipe,
} from './pipes';
import { ServiceModule } from './services';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

@NgModule({
  imports: [
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
    CategoryIconPipe,
    CategoryIdConverterPipe,
    CategoryLabelPipe,
    ContentLayoutComponent,
    DateTextPipe,
    DisciplineIconPipe,
    EditedDateTextPipe,
    EditPencilComponent,
    FillElementDirective,
    FooterComponent,
    FullscreenDirective,
    HeaderComponent,
    LengthPipe,
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
    SafeHtmlPipe,
    SidebarComponent,
    SidemenuToggleDirective,
    SwitchComponent,
    TabToTopComponent,
    ToggleThemeDirective,
    UserNamePipe,
  ],
  exports: [
    ActionButtonsComponent,
    CategoryIconPipe,
    CategoryIdConverterPipe,
    CategoryLabelPipe,
    CommonModule,
    DateTextPipe,
    DisciplineIconPipe,
    EditedDateTextPipe,
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
    SafeHtmlPipe,
    ServiceModule,
    SwitchComponent,
    TranslateModule,
    UserNamePipe,
  ],
})
export class SharedModule {}
