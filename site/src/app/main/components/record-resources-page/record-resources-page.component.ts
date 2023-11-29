import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
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
  RecordResource,
} from '@wbs/core/models';
import { IdService, Messages } from '@wbs/core/services';
import { RecordResourceViewModel } from '@wbs/core/view-models';
import { CheckPipe } from '@wbs/main/pipes/check.pipe';
import { RecordResourceValidation, Utils } from '@wbs/main/services';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
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
  @Input({ required: true }) list!: RecordResource[];
  @Input({ required: true }) owner!: string;
  @Input({ required: true }) projectId!: string;
  @Input({ required: true }) claims!: string[];
  @Input() taskId?: string;

  private modal?: NgbModalRef;

  readonly faPlus = faPlus;
  readonly addClaim = PROJECT_CLAIMS.RESOURCES.CREATE;
  readonly vm = signal<RecordResourceViewModel | undefined>(undefined);

  constructor(
    private readonly cd: ChangeDetectorRef,
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

    let obs: Observable<void> | undefined;

    if (vm.type === RESOURCE_TYPES.LINK) {
      obs = this.save({
        id: vm.id,
        type: vm.type,
        description: vm.description,
        name: vm.name,
        resource: vm.url,
      });
    } else {
      obs = this.uploadAndSave(vm.file!, {
        id: vm.id,
        type: vm.type,
        description: vm.description,
        name: vm.name,
      });
    }

    this.messages.block.show('.resource-editor', 'General.Saving');

    obs.subscribe(() => {
      this.messages.block.cancel('.resource-editor');
      this.modal?.close();
      this.messages.notify.success('Resources.ResourceSaved');
    });
  }

  saveReordered(records: RecordResource[]): void {
    let obs: Observable<void>[] = [];

    for (const record of records) {
      obs.push(
        this.data.projectResources.putAsync(
          this.owner,
          this.projectId,
          this.taskId,
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
    data: Partial<RecordResource>
  ): Observable<void> {
    if (!data.id) data.id = IdService.generate();

    return Utils.getFileAsync(rawFile).pipe(
      switchMap((file) =>
        this.data.resourceFiles.uploadAsync(this.owner, data.id!, file)
      ),
      switchMap(() => this.save(data))
    );
  }

  private save(data: Partial<RecordResource>): Observable<void> {
    const resource: RecordResource = {
      id: data.id ?? IdService.generate(),
      createdOn: data.createdOn ?? new Date(),
      lastModified: new Date(),
      name: data.name!,
      description: data.description!,
      type: data.type!,
      resource: data.resource,

      ownerId: this.owner,
      recordId: this.taskId ?? this.projectId,
      order: data.order ?? Math.max(...this.list.map((x) => x.order), 0) + 1,
    };

    return this.data.projectResources
      .putAsync(this.owner, this.projectId, this.taskId, resource)
      .pipe(
        map(() => {
          console.log('Saved');

          this.list = structuredClone([...this.list, resource]);
          this.cd.detectChanges();
        })
      );
  }
}
