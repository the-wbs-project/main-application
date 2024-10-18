import { computed, inject, Injectable } from '@angular/core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { FileInfo } from '@progress/kendo-angular-upload';
import { RecordResourceEditorComponent } from '@wbs/components/record-resources/components/editor';
import { DataServiceFactory } from '@wbs/core/data-services';
import { LIBRARY_CLAIMS, ContentResource } from '@wbs/core/models';
import { IdService, Messages, Utils } from '@wbs/core/services';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import {
  EntryActivityService,
  EntryTaskActivityService,
} from '../../../services';
import { LibraryStore } from '../store';

@Injectable()
export class LibraryResourcesService {
  private readonly versionActivity = inject(EntryActivityService);
  private readonly taskActivity = inject(EntryTaskActivityService);
  private readonly data = inject(DataServiceFactory);
  private readonly dialogService = inject(DialogService);
  private readonly messages = inject(Messages);
  private readonly store = inject(LibraryStore);

  //
  //  Computed
  //
  private readonly isDraft = computed(
    () => this.store.version()?.status === 'draft'
  );
  readonly canAdd = computed(
    () =>
      this.isDraft() &&
      Utils.contains(this.store.claims(), LIBRARY_CLAIMS.RESOURCES.CREATE)
  );
  readonly canEdit = computed(
    () =>
      this.isDraft() &&
      Utils.contains(this.store.claims(), LIBRARY_CLAIMS.RESOURCES.UPDATE)
  );
  readonly canDelete = computed(
    () =>
      this.isDraft() &&
      Utils.contains(this.store.claims(), LIBRARY_CLAIMS.RESOURCES.DELETE)
  );

  getRecordsAsync(taskId?: string): Observable<ContentResource[]> {
    const version = this.store.version()!;

    return this.data.contentResources.getAsync(
      version.ownerId,
      taskId ?? `${version.entryId}_${version.version}`
    );
  }

  launchAddAsync(
    taskId: string | undefined
  ): Observable<ContentResource | undefined> {
    const version = this.store.version()!;
    const save: (vm: {
      record: Partial<ContentResource>;
      file?: FileInfo;
    }) => Observable<ContentResource> = (vm) => {
      return this.save(taskId, vm.record, vm.file).pipe(
        switchMap((newRecord) =>
          (taskId
            ? this.taskActivity.resourceAdded(
                version.ownerId,
                version.entryId,
                version.version,
                taskId,
                newRecord
              )
            : this.versionActivity.resourceAdded(
                version.ownerId,
                version.entryId,
                version.version,
                newRecord
              )
          ).pipe(map(() => newRecord))
        )
      );
    };

    return RecordResourceEditorComponent.launchAddAsync(
      this.dialogService,
      save
    );
  }

  editRecordAsync(
    taskId: string | undefined,
    record: ContentResource
  ): Observable<ContentResource | undefined> {
    const version = this.store.version()!;
    const save: (vm: {
      record: Partial<ContentResource>;
      file?: FileInfo;
    }) => Observable<ContentResource> = (vm) => {
      return this.save(taskId, vm.record, vm.file).pipe(
        switchMap((newRecord) =>
          (taskId
            ? this.taskActivity.resourceUpdated(
                version.ownerId,
                version.entryId,
                version.version,
                taskId,
                newRecord
              )
            : this.versionActivity.resourceUpdated(
                version.ownerId,
                version.entryId,
                version.version,
                newRecord
              )
          ).pipe(map(() => newRecord))
        )
      );
    };

    return RecordResourceEditorComponent.launchEditAsync(
      this.dialogService,
      record,
      save
    );
  }

  deleteRecordAsync(
    taskId: string | undefined,
    record: ContentResource
  ): Observable<boolean> {
    const version = this.store.version()!;

    return this.messages.confirm
      .show('General.Confirm', 'Resources.DeleteResourceConfirm')
      .pipe(
        switchMap((answer) =>
          answer
            ? this.data.contentResources
                .deleteAsync(
                  version.ownerId,
                  taskId ?? `${version.entryId}_${version.version}`,
                  record.id
                )
                .pipe(
                  switchMap(() =>
                    taskId
                      ? this.taskActivity.resourceRemoved(
                          version.ownerId,
                          version.entryId,
                          version.version,
                          taskId,
                          record
                        )
                      : this.versionActivity.resourceRemoved(
                          version.ownerId,
                          version.entryId,
                          version.version,
                          record
                        )
                  ),
                  map(() => true)
                )
            : of(false)
        )
      );
  }

  saveRecordsAsync(
    taskId: string | undefined,
    records: Partial<ContentResource>[]
  ): Observable<ContentResource[]> {
    const version = this.store.version()!;
    let obs: Observable<ContentResource>[] = [];

    for (const record of records) {
      obs.push(this.save(taskId, record));
    }
    return forkJoin(obs).pipe(
      switchMap((records) =>
        (taskId
          ? this.taskActivity.resourceReordered(
              version.ownerId,
              version.entryId,
              version.version,
              taskId,
              records.map((x) => x.id)
            )
          : this.versionActivity.resourceReordered(
              version.ownerId,
              version.entryId,
              version.version,
              records.map((x) => x.id)
            )
        ).pipe(map(() => records))
      ),
      tap(() => this.messages.notify.success('Resources.ResourceSaved'))
    );
  }

  private save(
    taskId: string | undefined,
    data: Partial<ContentResource>,
    file?: FileInfo
  ): Observable<ContentResource> {
    const version = this.store.version()!;
    const resource: ContentResource = {
      id: data.id ?? IdService.generate(),
      ownerId: version.ownerId,
      parentId: taskId ?? `${version.entryId}_${version.version}`,
      createdOn: data.createdOn ?? new Date(),
      lastModified: new Date(),
      name: data.name!,
      description: data.description!,
      type: data.type!,
      resource: data.resource,
      order: data.order!, // ?? Math.max(...this.list().map((x) => x.order), 0) + 1,
    };

    return this.data.contentResources.putAsync(resource).pipe(
      switchMap(() => {
        if (!file) return of(resource);

        return Utils.getFileAsync(file).pipe(
          switchMap((file) =>
            this.data.contentResources
              .putFileAsync(
                version.ownerId,
                taskId ?? `${version.entryId}_${version.version}`,
                resource.id,
                file
              )
              .pipe(map(() => resource))
          )
        );
      }),
      map(() => resource)
    );
  }
}
