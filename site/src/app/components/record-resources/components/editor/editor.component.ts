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
  ContentResource,
} from '@wbs/core/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResourceTypeTextComponent } from '../type-text';
import { RecordResourceValidation } from '../../services';
import { RecordResourceViewModel } from '../../view-models';
import { IdService } from '@wbs/core/services';
import { SaveButtonComponent } from '@wbs/components/_utils/save-button.component';

declare type RecordEditResults = {
  record: Partial<ContentResource>;
  file?: FileInfo;
};

@Component({
  standalone: true,
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
    SaveButtonComponent,
    TextAreaModule,
    TextBoxModule,
    TranslateModule,
    UploaderComponent,
  ],
})
export class RecordResourceEditorComponent extends DialogContentBase {
  private saveFunction!: (
    results: RecordEditResults
  ) => Observable<ContentResource>;

  readonly validator = inject(RecordResourceValidation);
  //
  //  Signals
  //
  readonly isNew = signal(false);
  readonly isSaving = signal(false);
  readonly title = signal<string>('');
  readonly model = signal<RecordResourceViewModel | undefined>(undefined);
  //
  //  Computed
  //
  readonly errors = computed(() =>
    this.validator.validate(this.model(), this.isNew())
  );

  readonly typeList = [
    RESOURCE_TYPES.PDF,
    RESOURCE_TYPES.LINK,
    RESOURCE_TYPES.IMAGE,
  ];

  constructor(dialog: DialogRef) {
    super(dialog);
  }

  static launchAddAsync(
    dialog: DialogService,
    saveFunction: (vm: RecordEditResults) => Observable<ContentResource>
  ): Observable<ContentResource | undefined> {
    const ref = dialog.open({
      content: RecordResourceEditorComponent,
    });
    const component = ref.content.instance as RecordResourceEditorComponent;

    component.saveFunction = saveFunction;
    component.title.set('Resources.AddResource');
    component.isNew.set(true);
    component.model.set({
      description: '',
      name: '',
    });

    return ref.result.pipe(
      map((x: unknown) =>
        x instanceof DialogCloseResult ? undefined : <ContentResource>x
      )
    );
  }

  static launchEditAsync(
    dialog: DialogService,
    data: ContentResource,
    saveFunction: (vm: RecordEditResults) => Observable<ContentResource>
  ): Observable<ContentResource | undefined> {
    const ref = dialog.open({
      content: RecordResourceEditorComponent,
    });
    const component = ref.content.instance as RecordResourceEditorComponent;

    component.saveFunction = saveFunction;
    component.title.set('Resources.EditResource');
    component.isNew.set(false);
    component.model.set({
      id: data.id,
      name: data.name,
      description: data.description,
      url: data.resource,
      type: data.type,
    });

    return ref.result.pipe(
      map((x: unknown) =>
        x instanceof DialogCloseResult ? undefined : <ContentResource>x
      )
    );
  }

  save(): void {
    this.isSaving.set(true);
    const values = this.model()!;
    const model: Partial<ContentResource> = {
      id: values.id ?? IdService.generate(),
      name: values.name,
      description: values.description,
      resource: values.url,
      type: values.type!,
    };
    this.saveFunction({ record: model, file: values.file }).subscribe(
      (results) => {
        this.isSaving.set(false);
        this.dialog.close(results);
      }
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
