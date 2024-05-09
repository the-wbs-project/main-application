import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { FileInfo } from '@progress/kendo-angular-upload';
import { RESOURCE_TYPES } from '@wbs/core/models';
import { RecordResourceValidation } from '@wbs/core/services';
import { RecordResourceViewModel } from '@wbs/core/view-models';
import { InfoMessageComponent } from '@wbs/main/components/info-message.component';
import { UploaderComponent } from '@wbs/main/components/uploader';
import { ResourceTypeTextComponent } from '../record-resources-type-text';
import { RestrictionsPipe } from './pipes/restrictions.pipe';

@Component({
  standalone: true,
  selector: 'wbs-record-resource-editor',
  templateUrl: './record-resource-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DropDownListModule,
    FormsModule,
    InfoMessageComponent,
    NgClass,
    ResourceTypeTextComponent,
    RestrictionsPipe,
    TranslateModule,
    UploaderComponent,
  ],
})
export class RecordResourceEditorComponent {
  readonly vm = model.required<RecordResourceViewModel | undefined>();

  readonly typeList = [
    RESOURCE_TYPES.PDF,
    RESOURCE_TYPES.LINK,
    RESOURCE_TYPES.IMAGE,
    RESOURCE_TYPES.YOUTUBE,
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
