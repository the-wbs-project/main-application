import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { MultiSelectModule } from '@progress/kendo-angular-dropdowns';
import {
  CheckBoxModule,
  TextAreaModule,
  TextBoxModule,
} from '@progress/kendo-angular-inputs';
import {
  FloatingLabelModule,
  LabelModule,
} from '@progress/kendo-angular-label';
import { SharedModule } from '@wbs/module';
import {
  BottomButtonsComponent,
  DisciplinePickerComponent,
  OtherFlagsComponent,
  PhasePickerComponent,
  StarterComponent,
  TitleViewComponent,
  WbsCreateComponent,
} from './components';
import { NodeCreationState } from './state';

@NgModule({
  imports: [
    ButtonModule,
    CheckBoxModule,
    DialogModule,
    MultiSelectModule,
    FloatingLabelModule,
    LabelModule,
    NgxsModule.forFeature([NodeCreationState]),
    SharedModule,
    TextAreaModule,
    TextBoxModule,
  ],
  providers: [],
  declarations: [
    BottomButtonsComponent,
    DisciplinePickerComponent,
    OtherFlagsComponent,
    PhasePickerComponent,
    StarterComponent,
    TitleViewComponent,
    WbsCreateComponent,
  ],
  exports: [],
})
export class WbsNodeCreateModule {}
