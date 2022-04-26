import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { MultiSelectModule } from '@progress/kendo-angular-dropdowns';
import { TextAreaModule, TextBoxModule } from '@progress/kendo-angular-inputs';
import { FloatingLabelModule } from '@progress/kendo-angular-label';
import { SharedModule } from '@wbs/module';
import {
  DisciplinePickerComponent,
  PhasePickerComponent,
  StarterComponent,
  TitleViewComponent,
  WbsCreateComponent,
} from './components';
import { NodeCreationState } from './state';

@NgModule({
  imports: [
    ButtonModule,
    DialogModule,
    MultiSelectModule,
    FloatingLabelModule,
    NgxsModule.forFeature([NodeCreationState]),
    SharedModule,
    TextAreaModule,
    TextBoxModule,
  ],
  providers: [],
  declarations: [
    DisciplinePickerComponent,
    PhasePickerComponent,
    StarterComponent,
    TitleViewComponent,
    WbsCreateComponent,
  ],
  exports: [],
})
export class WbsNodeCreateModule {}
