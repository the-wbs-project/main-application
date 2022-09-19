import { NgModule } from '@angular/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { EditorModule } from '@progress/kendo-angular-editor';
import { TextAreaModule, TextBoxModule } from '@progress/kendo-angular-inputs';
import { FloatingLabelModule } from '@progress/kendo-angular-label';
import { CategoryListEditorModule } from '@wbs/components/_features';
import { SharedModule } from '@wbs/shared/module';
import { ActionMenuComponent } from './action-menu.component';
import { CategoryListComponent } from './category-list/category-list.component';
import {
  ProjectCategoryFilterPipe,
  ProjectCategorySortPipe,
} from './category-list/pipes';
import { TaskCreateDialogComponent } from './task-create-dialog/task-create-dialog.component';
import { TitleEditorComponent } from './title-editor/title-editor.component';
import { TitleIconComponent } from './title-icon.component';

@NgModule({
  imports: [
    ButtonModule,
    CategoryListEditorModule,
    EditorModule,
    FloatingLabelModule,
    SharedModule,
    TextAreaModule,
    TextBoxModule,
  ],
  declarations: [
    ActionMenuComponent,
    CategoryListComponent,
    ProjectCategoryFilterPipe,
    ProjectCategorySortPipe,
    TaskCreateDialogComponent,
    TitleEditorComponent,
    TitleIconComponent,
  ],
  exports: [
    ActionMenuComponent,
    CategoryListComponent,
    TaskCreateDialogComponent,
    TitleEditorComponent,
    TitleIconComponent,
  ],
})
export class ProjectComponentModule {}
