import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  DialogCloseResult,
  DialogContentBase,
  DialogModule,
  DialogRef,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { TextAreaModule, TextBoxModule } from '@progress/kendo-angular-inputs';
import { FileInfo } from '@progress/kendo-angular-upload';
import { InfoMessageComponent } from '@wbs/components/_utils/info-message.component';
import { UploaderComponent } from '@wbs/components/uploader';
import {
  RESOURCE_TYPE_TYPE,
  RESOURCE_TYPES,
  ResourceRecord,
} from '@wbs/core/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResourceTypeTextComponent } from '../type-text';
import { RecordResourceValidation } from '../../services';
import { RecordResourceViewModel } from '../../view-models';

@Component({
  standalone: true,
  selector: 'wbs-record-resource-editor',
  templateUrl: './editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RecordResourceValidation],
  imports: [
    ButtonModule,
    DialogModule,
    DropDownListModule,
    FormsModule,
    InfoMessageComponent,
    NgClass,
    ResourceTypeTextComponent,
    TextAreaModule,
    TextBoxModule,
    TranslateModule,
    UploaderComponent,
  ],
})
export class RecordResourceEditorComponent extends DialogContentBase {
  readonly validator = inject(RecordResourceValidation);
  //
  //  Signals
  //
  readonly title = signal<string>('');
  readonly model = signal<RecordResourceViewModel | undefined>(undefined);
  //
  //  Computed
  //
  readonly errors = computed(() => this.validator.validate(this.model()));

  readonly typeList = [
    RESOURCE_TYPES.PDF,
    RESOURCE_TYPES.LINK,
    RESOURCE_TYPES.IMAGE,
  ];

  constructor(dialog: DialogRef) {
    super(dialog);
  }

  static launchAddAsync(
    dialog: DialogService
  ): Observable<[Partial<ResourceRecord>, FileInfo | undefined] | undefined> {
    const ref = dialog.open({
      content: RecordResourceEditorComponent,
    });
    const component = ref.content.instance as RecordResourceEditorComponent;

    component.title.set('Resources.AddResource');
    component.model.set({
      description: '',
      name: '',
    });

    return ref.result.pipe(
      map((x: unknown) =>
        x instanceof DialogCloseResult ? undefined : <RecordResourceViewModel>x
      ),
      map((vm) =>
        vm
          ? [
              {
                type: vm.type,
                name: vm.name,
                description: vm.description,
                resource: vm.url,
              },
              vm.file,
            ]
          : undefined
      )
    );
  }

  static launchEditAsync(
    dialog: DialogService,
    data: ResourceRecord
  ): Observable<[ResourceRecord, FileInfo | undefined] | undefined> {
    const ref = dialog.open({
      content: RecordResourceEditorComponent,
    });
    const component = ref.content.instance as RecordResourceEditorComponent;

    component.title.set('Resources.EditResource');
    component.model.set({
      id: data.id,
      name: data.name,
      description: data.description,
      url: data.resource,
      type: data.type,
    });

    return ref.result.pipe(
      map((x: unknown) =>
        x instanceof DialogCloseResult ? undefined : <RecordResourceViewModel>x
      ),
      map((vm) => {
        if (!vm) return undefined;

        data.name = vm.name;
        data.description = vm.description;
        data.resource = vm.url;
        data.type = vm.type!;

        return [data, vm.file];
      })
    );
  }

  typeChanged(type: RESOURCE_TYPE_TYPE): void {
    this.model.update((vm) => (vm ? { ...vm, type } : undefined));
  }

  nameChanged(name: string): void {
    this.model.update((vm) => (vm ? { ...vm, name } : undefined));
  }

  descriptionChanged(description: string): void {
    this.model.update((vm) => (vm ? { ...vm, description } : undefined));
  }

  urlChanged(url: string): void {
    this.model.update((vm) => (vm ? { ...vm, url } : undefined));
  }

  setFile(file: FileInfo | undefined): void {
    this.model.update((vm) => (vm ? { ...vm, file } : undefined));
  }
}
