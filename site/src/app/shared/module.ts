import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import {
  EditPencilComponent,
  PageHeaderComponent,
  SwitchComponent,
} from './components';
import {
  EditorFixerDirective,
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
  SafeUrlPipe,
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
    CategoryIconPipe,
    CategoryIdConverterPipe,
    CategoryLabelListPipe,
    CategoryLabelPipe,
    DateTextPipe,
    DisciplineIconPipe,
    EditedDateTextPipe,
    EditorFixerDirective,
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
    SafeUrlPipe,
    SwitchComponent,
    UserNamePipe,
  ],
  exports: [
    CategoryIconPipe,
    CategoryIdConverterPipe,
    CategoryLabelListPipe,
    CategoryLabelPipe,
    CommonModule,
    DateTextPipe,
    DisciplineIconPipe,
    EditedDateTextPipe,
    EditorFixerDirective,
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
    SafeUrlPipe,
    SwitchComponent,
    TranslateModule,
    UserNamePipe,
  ],
})
export class SharedModule {}
