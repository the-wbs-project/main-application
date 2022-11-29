import { NgModule } from '@angular/core';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { SharedBasicModule } from '@wbs/shared/basic-module';
import { TextEditorComponent } from './text-editor.component';

@NgModule({
  imports: [TextBoxModule, SharedBasicModule],
  declarations: [TextEditorComponent],
  exports: [TextEditorComponent],
})
export class TextEditorModule {}
