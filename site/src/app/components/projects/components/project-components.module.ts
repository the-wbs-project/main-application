import { NgModule } from '@angular/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { TextAreaModule, TextBoxModule } from '@progress/kendo-angular-inputs';
import { CategoryListEditorModule } from '@wbs/components/_features';
import { SharedModule } from '@wbs/shared/module';
import { ActionMenuComponent } from './action-menu.component';
import { TaskCreateDialogComponent } from './task-create-dialog/task-create-dialog.component';
import { TitleEditorComponent } from './title-editor/title-editor.component';
import { TitleIconComponent } from './title-icon.component';

@NgModule({
  imports: [
    ButtonModule,
    CategoryListEditorModule,
    SharedModule,
    TextAreaModule,
    TextBoxModule,
  ],
  declarations: [
    ActionMenuComponent,
    TaskCreateDialogComponent,
    TitleEditorComponent,
    TitleIconComponent,
  ],
  exports: [
    ActionMenuComponent,
    TaskCreateDialogComponent,
    TitleEditorComponent,
    TitleIconComponent,
  ],
})
export class ProjectComponentModule {}
