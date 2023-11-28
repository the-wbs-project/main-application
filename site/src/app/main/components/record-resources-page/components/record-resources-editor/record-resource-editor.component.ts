import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { FileInfo } from '@progress/kendo-angular-upload';
import { RESOURCE_TYPES } from '@wbs/core/models';
import { RecordResourceViewModel } from '@wbs/core/view-models';
import { UploaderComponent } from '@wbs/main/components/uploader/uploader.component';
import { RecordResourceValidation } from '@wbs/main/services';
import { ResourceTypeTextComponent } from '../record-resources-type-text/resource-type-text.component';
import { RestrictionsPipe } from './pipes/restrictions.pipe';

@Component({
  standalone: true,
  selector: 'wbs-record-resource-editor',
  templateUrl: './record-resource-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DropDownListModule,
    FormsModule,
    NgClass,
    ResourceTypeTextComponent,
    RestrictionsPipe,
    TranslateModule,
    UploaderComponent,
  ],
})
export class RecordResourceEditorComponent {
  @Input({ required: true }) vm!: RecordResourceViewModel;

  readonly typeList = [
    RESOURCE_TYPES.PDF,
    RESOURCE_TYPES.LINK,
    RESOURCE_TYPES.IMAGE,
    RESOURCE_TYPES.YOUTUBE,
  ];

  constructor(readonly validator: RecordResourceValidation) {}

  setFile(file: FileInfo | undefined): void {
    this.vm.file = file;

    if (this.vm.errors.started) {
      this.validator.validateFile(this.vm);
    }
  }
}
