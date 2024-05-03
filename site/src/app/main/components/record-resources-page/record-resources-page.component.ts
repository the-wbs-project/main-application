import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import {
  DialogModule,
  DialogRef,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { FileInfo } from '@progress/kendo-angular-upload';
import { InfoComponent } from '@wbs/components/info/info.component';
import { RESOURCE_TYPES, ResourceRecord } from '@wbs/core/models';
import { RecordResourceValidation } from '@wbs/core/services';
import { RecordResourceViewModel } from '@wbs/core/view-models';
import { CheckPipe } from '@wbs/pipes/check.pipe';
import { RecordResourceEditorComponent } from './components/record-resources-editor';
import { RecordResourceListComponent } from './components/record-resources-list';

@Component({
  standalone: true,
  selector: 'wbs-record-resources-page',
  templateUrl: './record-resources-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CheckPipe,
    DialogModule,
    FontAwesomeModule,
    InfoComponent,
    RecordResourceEditorComponent,
    RecordResourceListComponent,
    RouterModule,
    TranslateModule,
  ],
  providers: [RecordResourceValidation],
})
export class RecordResourcesPageComponent {
  readonly saveRecords = output<Partial<ResourceRecord>[]>();
  readonly uploadAndSave = output<{
    rawFile: FileInfo;
    data: Partial<ResourceRecord>;
  }>();

  readonly list = input.required<ResourceRecord[]>();
  readonly owner = input.required<string>();
  readonly claims = input.required<string[]>();
  readonly addClaim = input.required<string>();

  modal?: DialogRef;

  readonly faPlus = faPlus;
  readonly vm = model<RecordResourceViewModel | undefined>(undefined);

  constructor(
    private readonly dialogService: DialogService,
    private readonly validator: RecordResourceValidation
  ) {}

  launchNew(content: any): void {
    this.vm.set({
      description: '',
      name: '',
      url: '',
      errors: {},
    });
    this.modal = this.dialogService.open({
      content,
    });
  }

  saveClicked(): void {
    const vm = structuredClone(this.vm()!);
    const valid = this.validator.validate(vm);

    this.vm.set(vm);

    if (!valid) return;
    if (vm.type === RESOURCE_TYPES.LINK) {
      this.saveRecords.emit([
        {
          id: vm.id,
          type: vm.type,
          description: vm.description,
          name: vm.name,
          resource: vm.url,
        },
      ]);
    } else {
      this.uploadAndSave.emit({
        rawFile: vm.file!,
        data: {
          id: vm.id,
          type: vm.type,
          description: vm.description,
          name: vm.name,
        },
      });
    }

    this.modal?.close();
  }
}
