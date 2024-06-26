import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { TextAreaModule, TextBoxModule } from '@progress/kendo-angular-inputs';
import { FileInfo } from '@progress/kendo-angular-upload';
import { RESOURCE_TYPES } from '@wbs/core/models';
import { RecordResourceViewModel } from '@wbs/core/view-models';
import { InfoMessageComponent } from '@wbs/components/_utils/info-message.component';
import { UploaderComponent } from '@wbs/components/uploader';
import { RecordResourceValidation } from '../../services';
import { ResourceTypeTextComponent } from '../record-resources-type-text';
import { RestrictionsPipe } from './pipes/restrictions.pipe';

@Component({
  standalone: true,
  selector: 'wbs-record-resource-editor',
  templateUrl: './record-resource-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RecordResourceValidation],
  imports: [
    ButtonModule,
    DropDownListModule,
    FormsModule,
    InfoMessageComponent,
    NgClass,
    ResourceTypeTextComponent,
    RestrictionsPipe,
    TextAreaModule,
    TextBoxModule,
    TranslateModule,
    UploaderComponent,
  ],
})
export class RecordResourceEditorComponent {
  readonly title = input.required<string>();
  readonly vm = model.required<RecordResourceViewModel | undefined>();
  readonly cancelClicked = output<void>();
  readonly saveClicked = output<void>();

  readonly typeList = [
    RESOURCE_TYPES.PDF,
    RESOURCE_TYPES.LINK,
    RESOURCE_TYPES.IMAGE,
    //RESOURCE_TYPES.YOUTUBE,
  ];

  constructor(readonly validator: RecordResourceValidation) {}

  setFile(file: FileInfo | undefined): void {
    this.vm.update((vm) => {
      if (!vm) return;

      vm.file = file;

      if (vm.errors.started) {
        this.validator.validateFile(vm);
      }
      return vm;
    });
  }
}
