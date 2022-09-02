import { NgModule } from '@angular/core';
import { TextAreaModule, TextBoxModule } from '@progress/kendo-angular-inputs';
import { CategoryListEditorModule } from '@wbs/components/_features';
import { SharedModule } from '@wbs/shared/module';
import { ActionMenuComponent } from './action-menu.component';
import { TaskCreateDialogComponent } from './task-create-dialog/task-create-dialog.component';
import { TitleIconComponent } from './title-icon.component';

@NgModule({
  imports: [
    CategoryListEditorModule,
    SharedModule,
    TextAreaModule,
    TextBoxModule,
  ],
  declarations: [
    ActionMenuComponent,
    TaskCreateDialogComponent,
    TitleIconComponent,
  ],
  exports: [ActionMenuComponent, TaskCreateDialogComponent, TitleIconComponent],
})
export class ProjectComponentModule {}
