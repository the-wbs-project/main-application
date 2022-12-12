import { NgModule } from '@angular/core';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { SharedBasicModule } from '@wbs/shared/basic-module';
import { TextEditorComponent } from './text-editor.component';
import { TextOverflowHandlerDirective } from './text-overflow-handler.directive';

@NgModule({
  imports: [TextBoxModule, SharedBasicModule],
  declarations: [TextEditorComponent, TextOverflowHandlerDirective],
  exports: [TextEditorComponent],
})
export class TextEditorModule {}
