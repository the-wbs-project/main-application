import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { FormFieldModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { SortableModule } from '@progress/kendo-angular-sortable';
import { SharedModule } from '@wbs/shared/module';
import { CategoryListEditorComponent } from './category-list-editor.component';
import { CustomDialogComponent } from './custom-dialog/custom-dialog.component';

@NgModule({
  imports: [
    DialogModule,
    FormFieldModule,
    FormsModule,
    LabelModule,
    ReactiveFormsModule,
    SharedModule,
    SortableModule,
  ],
  declarations: [CategoryListEditorComponent, CustomDialogComponent],
  exports: [CategoryListEditorComponent],
})
export class CategoryListEditorModule {}
