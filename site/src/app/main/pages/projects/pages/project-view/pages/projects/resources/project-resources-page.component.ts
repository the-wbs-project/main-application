import { NgIf } from '@angular/common';
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
import { RecordResourceEditorComponent } from '@wbs/main/components/record-resources-editor/record-resource-editor.component';
import { RecordResourceListComponent } from '@wbs/main/components/record-resources-list/record-resource-list.component';
import { CheckPipe } from '@wbs/main/pipes/check.pipe';
import { RecordResourceValidation, Utils } from '@wbs/main/services';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  standalone: true,
  templateUrl: './project-resources-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CheckPipe,
    FontAwesomeModule,
    NgIf,
    RecordResourceEditorComponent,
    RecordResourceListComponent,
    RouterModule,
    TranslateModule,
  ],
  providers: [RecordResourceValidation],
})
export class ProjectResourcesPageComponent {
  @Input({ required: true }) list!: RecordResource[];
  @Input({ required: true }) owner!: string;
  @Input({ required: true }) projectId!: string;
  @Input({ required: true }) claims!: string[];

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
    //this.messages.notify.info('Coming soon...', false);
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

  private uploadAndSave(
    rawFile: FileInfo,
    data: Partial<RecordResource>
  ): Observable<void> {
    if (!data.id) data.id = IdService.generate();

    return Utils.getFileAsync(rawFile).pipe(
      switchMap((file) =>
        this.data.staticFiles.uploadForOwnerAsync(this.owner, data.id!, file)
      ),
      switchMap(() => this.save(data))
    );
  }

  private save(data: Partial<RecordResource>): Observable<void> {
    const resource: RecordResource = {
      id: data.id ?? IdService.generate(),
      createdOn: new Date(),
      lastModified: new Date(),
      name: data.name!,
      description: data.description!,
      type: data.type!,
      resource: data.resource,

      ownerId: this.owner,
      recordId: this.projectId,
      order: data.order ?? Math.max(...this.list.map((x) => x.order), 0) + 1,
    };

    return this.data.projectResources.putAsync(resource).pipe(
      map(() => {
        console.log('Saved');

        this.list = structuredClone([...this.list, resource]);
        this.cd.detectChanges();
      })
    );
  }
}
