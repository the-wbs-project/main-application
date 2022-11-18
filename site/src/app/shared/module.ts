import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import {
  ActionButtonsComponent,
  EditPencilComponent,
  PageHeaderComponent,
  SwitchComponent,
} from './components';
import {
  FillElementDirective,
  MatchSizeDirective,
  ProgressBarDirective,
} from './directives';
import {
  CategoryIconPipe,
  CategoryIdConverterPipe,
  CategoryLabelListPipe,
  CategoryLabelPipe,
  DateTextPipe,
  DisciplineIconPipe,
  EditedDateTextPipe,
  JoinPipe,
  LengthPipe,
  ProjectListFilterLengthPipe,
  ProjectListFilterPipe,
  ProjectStatusPipe,
  RoleListPipe,
  SafeHtmlPipe,
  UserNamePipe,
} from './pipes';

@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    RouterModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    ActionButtonsComponent,
    CategoryIconPipe,
    CategoryIdConverterPipe,
    CategoryLabelListPipe,
    CategoryLabelPipe,
    DateTextPipe,
    DisciplineIconPipe,
    EditedDateTextPipe,
    EditPencilComponent,
    FillElementDirective,
    JoinPipe,
    LengthPipe,
    MatchSizeDirective,
    PageHeaderComponent,
    ProgressBarDirective,
    ProjectListFilterPipe,
    ProjectListFilterLengthPipe,
    ProjectStatusPipe,
    RoleListPipe,
    SafeHtmlPipe,
    SwitchComponent,
    UserNamePipe,
  ],
  exports: [
    ActionButtonsComponent,
    CategoryIconPipe,
    CategoryIdConverterPipe,
    CategoryLabelListPipe,
    CategoryLabelPipe,
    CommonModule,
    DateTextPipe,
    DisciplineIconPipe,
    EditedDateTextPipe,
    EditPencilComponent,
    FillElementDirective,
    FontAwesomeModule,
    FormsModule,
    JoinPipe,
    MatchSizeDirective,
    PageHeaderComponent,
    ProgressBarDirective,
    ProjectStatusPipe,
    RoleListPipe,
    SafeHtmlPipe,
    SwitchComponent,
    TranslateModule,
    UserNamePipe,
  ],
})
export class SharedModule {}
