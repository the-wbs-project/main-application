import { computed, inject, Injectable } from '@angular/core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { FileInfo } from '@progress/kendo-angular-upload';
import { RecordResourceEditorComponent } from '@wbs/components/record-resources/components/editor';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  APP_CONFIG_TOKEN,
  LIBRARY_CLAIMS,
  RESOURCE_TYPES,
  ResourceRecord,
} from '@wbs/core/models';
import { IdService, Messages, Utils } from '@wbs/core/services';
import { EntryActivityService } from '@wbs/core/services/library';
import { EntryStore } from '@wbs/core/store';
import { LibraryVersionViewModel } from '@wbs/core/view-models';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

@Injectable()
export class LibraryResourcesService {
  private readonly activity = inject(EntryActivityService);
  private readonly appConfig = inject(APP_CONFIG_TOKEN);
  private readonly data = inject(DataServiceFactory);
  private readonly dialogService = inject(DialogService);
  private readonly entryStore = inject(EntryStore);
  private readonly messages = inject(Messages);

  //
  //  Computed
  //
  private readonly isDraft = computed(
    () => this.entryStore.version()?.status === 'draft'
  );
  readonly canAdd = computed(
    () =>
      this.isDraft() &&
      Utils.contains(this.entryStore.claims(), LIBRARY_CLAIMS.RESOURCES.CREATE)
  );
  readonly canEdit = computed(
    () =>
      this.isDraft() &&
      Utils.contains(this.entryStore.claims(), LIBRARY_CLAIMS.RESOURCES.UPDATE)
  );
  readonly canDelete = computed(
    () =>
      this.isDraft() &&
      Utils.contains(this.entryStore.claims(), LIBRARY_CLAIMS.RESOURCES.DELETE)
  );

  getRecordsAsync(taskId?: string): Observable<ResourceRecord[]> {
    const version = this.entryStore.version()!;

    return this.data.libraryEntryResources.getAsync(
      version.ownerId,
      version.entryId,
      version.version,
      taskId
    );
  }

  launchAddAsync(
    taskId: string | undefined
  ): Observable<ResourceRecord | undefined> {
    return RecordResourceEditorComponent.launchAddAsync(
      this.dialogService
    ).pipe(
      switchMap((x) =>
        x == undefined
          ? of(undefined)
          : x[0].type === RESOURCE_TYPES.LINK
          ? this.save(taskId, x[0])
          : this.uploadAndSaveAsync(taskId, x[1]!, x[0])
      )
    );
  }

  editRecordAsync(
    taskId: string | undefined,
    record: ResourceRecord
  ): Observable<ResourceRecord | undefined> {
    return RecordResourceEditorComponent.launchEditAsync(
      this.dialogService,
      record
    ).pipe(
      switchMap((x) =>
        x == undefined
          ? of(undefined)
          : x[0].type === RESOURCE_TYPES.LINK
          ? this.save(taskId, x[0])
          : this.uploadAndSaveAsync(taskId, x[1]!, x[0])
      )
    );
  }

  deleteRecordAsync(
    taskId: string | undefined,
    record: ResourceRecord
  ): Observable<boolean> {
    const version = this.entryStore.version()!;

    return this.messages.confirm
      .show('General.Confirm', 'Resources.DeleteResourceConfirm')
      .pipe(
        switchMap((answer) =>
          answer
            ? this.data.libraryEntryResources
                .deleteAsync(
                  version.ownerId,
                  version.entryId,
                  version.version,
                  taskId,
                  record.id
                )
                .pipe(map(() => true))
            : of(false)
        )
      );
  }

  saveRecordsAsync(
    taskId: string | undefined,
    records: Partial<ResourceRecord>[]
  ): Observable<ResourceRecord[]> {
    let obs: Observable<ResourceRecord>[] = [];

    for (const record of records) {
      obs.push(this.save(taskId, record));
    }
    return forkJoin(obs).pipe(
      tap(() => this.messages.notify.success('Resources.ResourceSaved'))
    );
  }

  uploadAndSaveAsync(
    taskId: string | undefined,
    rawFile: FileInfo,
    data: Partial<ResourceRecord>
  ): Observable<ResourceRecord> {
    const version = this.entryStore.version()!;

    if (!data.id) data.id = IdService.generate();

    data.resource = rawFile.name;

    return Utils.getFileAsync(rawFile).pipe(
      switchMap((file) => {
        return this.save(taskId, data).pipe(
          switchMap((record) =>
            this.data.libraryEntryResources
              .putFileAsync(
                version.ownerId,
                version.entryId,
                version.version,
                taskId,
                data.id!,
                file
              )
              .pipe(map(() => record))
          )
        );
      }),
      tap(() => this.messages.notify.success('Resources.ResourceSaved'))
    );
  }

  getApiUrl(taskId?: string): string {
    const version = this.entryStore.version()!;
    const parts = [
      this.appConfig.api_domain,
      'api',
      'portfolio',
      version.ownerId,
      'library',
      'entries',
      version.entryId,
      'versions',
      version.version,
    ];

    if (taskId) parts.push('nodes', taskId);

    return parts.join('/');
  }

  private save(
    taskId: string | undefined,
    data: Partial<ResourceRecord>
  ): Observable<ResourceRecord> {
    const version = this.entryStore.version()!;
    const resource: ResourceRecord = {
      id: data.id ?? IdService.generate(),
      createdOn: data.createdOn ?? new Date(),
      lastModified: new Date(),
      name: data.name!,
      description: data.description!,
      type: data.type!,
      resource: data.resource,
      order: data.order!, // ?? Math.max(...this.list().map((x) => x.order), 0) + 1,
    };

    return this.data.libraryEntryResources
      .putAsync(
        version.ownerId,
        version.entryId,
        version.version,
        taskId,
        resource
      )
      .pipe(map(() => resource));
  }
}
