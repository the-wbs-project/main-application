import { computed, inject, Injectable } from '@angular/core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { FileInfo } from '@progress/kendo-angular-upload';
import { RecordResourceEditorComponent } from '@wbs/components/record-resources/components/editor';
import { DataServiceFactory } from '@wbs/core/data-services';
import { LIBRARY_CLAIMS, ContentResource } from '@wbs/core/models';
import { IdService, Messages, Utils } from '@wbs/core/services';
import {
  EntryActivityService,
  EntryTaskActivityService,
} from '@wbs/core/services/library';
import { EntryStore } from '@wbs/core/store';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

@Injectable()
export class LibraryResourcesService {
  private readonly versionActivity = inject(EntryActivityService);
  private readonly taskActivity = inject(EntryTaskActivityService);
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

  getRecordsAsync(taskId?: string): Observable<ContentResource[]> {
    const version = this.entryStore.version()!;

    return this.data.contentResources.getAsync(
      version.ownerId,
      taskId ?? `${version.entryId}_${version.version}`
    );
  }

  launchAddAsync(
    taskId: string | undefined
  ): Observable<ContentResource | undefined> {
    const version = this.entryStore.version()!;

    return RecordResourceEditorComponent.launchAddAsync(
      this.dialogService
    ).pipe(
      switchMap((data) =>
        data.record == undefined
          ? of(undefined)
          : this.save(taskId, data.record)
      ),
      switchMap((record) =>
        !record
          ? of(undefined)
          : (taskId
              ? this.taskActivity.resourceUpdated(
                  version.entryId,
                  version.version,
                  taskId,
                  record
                )
              : this.versionActivity.resourceUpdated(
                  version.entryId,
                  version.version,
                  record
                )
            ).pipe(map(() => record))
      )
    );
  }

  editRecordAsync(
    taskId: string | undefined,
    record: ContentResource
  ): Observable<ContentResource | undefined> {
    const version = this.entryStore.version()!;

    return RecordResourceEditorComponent.launchEditAsync(
      this.dialogService,
      record
    ).pipe(
      switchMap((data) =>
        data.record == undefined
          ? of(undefined)
          : this.save(taskId, data.record)
      ),
      switchMap((record) =>
        !record
          ? of(undefined)
          : (taskId
              ? this.taskActivity.resourceUpdated(
                  version.entryId,
                  version.version,
                  taskId,
                  record
                )
              : this.versionActivity.resourceUpdated(
                  version.entryId,
                  version.version,
                  record
                )
            ).pipe(map(() => record))
      )
    );
  }

  deleteRecordAsync(
    taskId: string | undefined,
    record: ContentResource
  ): Observable<boolean> {
    const version = this.entryStore.version()!;

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
                          version.entryId,
                          version.version,
                          taskId,
                          record
                        )
                      : this.versionActivity.resourceRemoved(
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
    const version = this.entryStore.version()!;
    let obs: Observable<ContentResource>[] = [];

    for (const record of records) {
      obs.push(this.save(taskId, record));
    }
    return forkJoin(obs).pipe(
      switchMap((records) =>
        (taskId
          ? this.taskActivity.resourceReordered(
              version.entryId,
              version.version,
              taskId,
              records.map((x) => x.id)
            )
          : this.versionActivity.resourceReordered(
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
    const version = this.entryStore.version()!;
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
