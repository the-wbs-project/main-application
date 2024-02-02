import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  input,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { FileInfo } from '@progress/kendo-angular-upload';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  PROJECT_CLAIMS,
  RESOURCE_TYPES,
  ResourceRecord,
} from '@wbs/core/models';
import { Messages } from '@wbs/core/services';
import { RecordResourceViewModel } from '@wbs/core/view-models';
import { CheckPipe } from '@wbs/main/pipes/check.pipe';
import { RecordResourceValidation } from '@wbs/main/services';
import { RecordResourceEditorComponent } from './components/record-resources-editor/record-resource-editor.component';
import { RecordResourceListComponent } from './components/record-resources-list/record-resource-list.component';

@Component({
  standalone: true,
  selector: 'wbs-record-resources-page',
  templateUrl: './record-resources-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CheckPipe,
    FontAwesomeModule,
    RecordResourceEditorComponent,
    RecordResourceListComponent,
    RouterModule,
    TranslateModule,
  ],
  providers: [RecordResourceValidation],
})
export class RecordResourcesPageComponent {
  @Output() readonly saveRecords = new EventEmitter<
    Partial<ResourceRecord>[]
  >();
  @Output() readonly uploadAndSave = new EventEmitter<{
    rawFile: FileInfo;
    data: Partial<ResourceRecord>;
  }>();

  readonly list = input.required<ResourceRecord[]>();
  readonly owner = input.required<string>();
  readonly claims = input.required<string[]>();

  private modal?: NgbModalRef;

  readonly faPlus = faPlus;
  readonly addClaim = PROJECT_CLAIMS.RESOURCES.CREATE;
  readonly vm = signal<RecordResourceViewModel | undefined>(undefined);

  constructor(
    private readonly data: DataServiceFactory,
    private readonly messages: Messages,
    private readonly modalService: NgbModal,
    private readonly validator: RecordResourceValidation
  ) {}

  launchNew(content: any): void {
    this.vm.set({
      description: '',
      name: '',
      url: '',
      errors: {},
    });
    this.modal = this.modalService.open(content, {
      fullscreen: true,
      modalDialogClass: 'modal-almost-fullscreen',
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
    /*
    this.messages.block.show('.resource-editor', 'General.Saving');

    obs.subscribe(() => {
      this.messages.block.cancel('.resource-editor');
      this.modal?.close();
      this.messages.notify.success('Resources.ResourceSaved');
    });*/
  }

  /*
  saveReordered(records: ResourceRecord[]): void {
    let obs: Observable<void>[] = [];

    for (const record of records) {
      obs.push(
        this.data.projectResources.putAsync(
          this.owner(),
          this.projectId(),
          this.taskId(),
          record
        )
      );
    }
    forkJoin(obs).subscribe(() =>
      this.messages.notify.success('Resources.ResourceSaved')
    );
  }

  private uploadAndSave(
    rawFile: FileInfo,
    data: Partial<ResourceRecord>
  ): Observable<void> {
    if (!data.id) data.id = IdService.generate();

    return Utils.getFileAsync(rawFile).pipe(
      switchMap((file) =>
        this.data.resourceFiles.uploadAsync(this.owner(), data.id!, file)
      ),
      switchMap(() => this.save(data))
    );
  }

  private save(data: Partial<ResourceRecord>): Observable<void> {
    const resource: ResourceRecord = {
      id: data.id ?? IdService.generate(),
      createdOn: data.createdOn ?? new Date(),
      lastModified: new Date(),
      name: data.name!,
      description: data.description!,
      type: data.type!,
      resource: data.resource,
      order: data.order ?? Math.max(...this.list().map((x) => x.order), 0) + 1,
    };

    return this.data.projectResources
      .putAsync(this.owner(), this.projectId(), this.taskId(), resource)
      .pipe(
        map(() => {
          console.log('Saved');

          this.list = structuredClone([...this.list(), resource]);
          this.cd.detectChanges();
        })
      );
  }*/
}
