import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormFieldModule, SwitchModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { SortableModule } from '@progress/kendo-angular-sortable';
import { SharedModule } from '@wbs/shared/module';
import { CategoryListEditorComponent } from './category-list-editor.component';
import { CustomDialog2Component } from './custom-dialog/custom-dialog.component';

@NgModule({
  imports: [
    FormFieldModule,
    FormsModule,
    LabelModule,
    ReactiveFormsModule,
    SharedModule,
    SortableModule,
    SwitchModule,
  ],
  declarations: [CategoryListEditorComponent, CustomDialog2Component],
  exports: [CategoryListEditorComponent],
})
export class CategoryListEditorModule {}
