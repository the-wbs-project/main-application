import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { TextAreaModule, TextBoxModule } from '@progress/kendo-angular-inputs';
import { FloatingLabelModule } from '@progress/kendo-angular-label';
import { SharedModule } from '@wbs/module';
import {
  NameViewComponent,
  Page1Component,
  WbsCreateComponent,
} from './components';
import { NodeCreationState } from './state';

@NgModule({
  imports: [
    ButtonModule,
    DialogModule,
    FloatingLabelModule,
    NgxsModule.forFeature([NodeCreationState]),
    SharedModule,
    TextAreaModule,
    TextBoxModule,
  ],
  providers: [],
  declarations: [NameViewComponent, Page1Component, WbsCreateComponent],
  exports: [],
})
export class WbsNodeCreateModule {}
