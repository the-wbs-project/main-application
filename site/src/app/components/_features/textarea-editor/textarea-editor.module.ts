import { NgModule } from '@angular/core';
import { EditorModule } from '@progress/kendo-angular-editor';
import { SharedModule } from '@wbs/shared/module';
import { TextareaEditorComponent } from './textarea-editor.component';

@NgModule({
  imports: [EditorModule, SharedModule],
  declarations: [TextareaEditorComponent],
  exports: [TextareaEditorComponent],
})
export class TextareaEditorModule {}
