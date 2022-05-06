import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { MultiSelectModule } from '@progress/kendo-angular-dropdowns';
import { CheckBoxModule, TextBoxModule } from '@progress/kendo-angular-inputs';
import {
  FloatingLabelModule,
  LabelModule,
} from '@progress/kendo-angular-label';
import { SharedModule } from '@wbs/shared/module';
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
    MultiSelectModule,
    FloatingLabelModule,
    LabelModule,
    NgxsModule.forFeature([NodeCreationState]),
    SharedModule,
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
