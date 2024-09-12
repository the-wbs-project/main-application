import { inject, Signal } from '@angular/core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { FileInfo } from '@progress/kendo-angular-upload';
import {
  RecordEditResults,
  RecordResourceEditorComponent,
} from '@wbs/components/record-resources/components/editor';
import { DataServiceFactory } from '@wbs/core/data-services';
import { ContentResource } from '@wbs/core/models';
import { IdService, Messages, Utils } from '@wbs/core/services';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

export abstract class BaseProjectResourceService {
  protected readonly data = inject(DataServiceFactory);
  protected readonly dialogService = inject(DialogService);
  protected readonly messages = inject(Messages);

  protected abstract getOwner(): string;
  protected abstract getParentId(): string;

  protected abstract recordAddedActivity(
    record: ContentResource
  ): Observable<void>;

  protected abstract recordUpdatedActivity(
    record: ContentResource
  ): Observable<void>;

  protected abstract recordRemovedActivity(
    record: ContentResource
  ): Observable<void>;

  protected abstract recordReorderedActivity(ids: string[]): Observable<void>;

  getRecordsAsync(): Observable<ContentResource[]> {
    return this.data.contentResources.getAsync(
      this.getOwner(),
      this.getParentId()
    );
  }

  addAsync(): Observable<ContentResource | undefined> {
    const save: (vm: RecordEditResults) => Observable<ContentResource> = (
      vm
    ) => {
      return this.save(vm.record, vm.file).pipe(
        switchMap((newRecord) =>
          this.recordAddedActivity(newRecord).pipe(map(() => newRecord))
        )
      );
    };
    return RecordResourceEditorComponent.launchAddAsync(
      this.dialogService,
      save
    );
  }

  editAsync(record: ContentResource): Observable<ContentResource | undefined> {
    const save: (vm: {
      record: Partial<ContentResource>;
      file?: FileInfo;
    }) => Observable<ContentResource> = (vm) => {
      return this.save(vm.record, vm.file).pipe(
        switchMap((newRecord) =>
          this.recordUpdatedActivity(newRecord).pipe(map(() => newRecord))
        )
      );
    };

    return RecordResourceEditorComponent.launchEditAsync(
      this.dialogService,
      record,
      save
    );
  }

  deleteAsync(record: ContentResource): Observable<boolean> {
    const owner = this.getOwner();
    const parentId = this.getParentId();

    return this.messages.confirm
      .show('General.Confirm', 'Resources.DeleteResourceConfirm')
      .pipe(
        switchMap((answer) =>
          answer
            ? this.data.contentResources
                .deleteAsync(owner, parentId, record.id)
                .pipe(
                  switchMap(() => this.recordRemovedActivity(record)),
                  map(() => true)
                )
            : of(false)
        )
      );
  }

  reorderAsync(records: ContentResource[]): Observable<ContentResource[]> {
    const obs: Observable<ContentResource>[] = [];

    for (const record of records) {
      obs.push(this.save(record));
    }
    return forkJoin(obs).pipe(
      tap(() => this.messages.notify.success('Resources.ResourceSaved')),
      switchMap((records) =>
        this.recordReorderedActivity(records.map((x) => x.id)).pipe(
          map(() => records)
        )
      )
    );
  }

  protected save(
    data: Partial<ContentResource>,
    file?: FileInfo
  ): Observable<ContentResource> {
    const owner = this.getOwner();
    const parentId = this.getParentId();

    const resource: ContentResource = {
      id: data.id ?? IdService.generate(),
      ownerId: owner,
      parentId,
      createdOn: data.createdOn ?? new Date(),
      lastModified: new Date(),
      name: data.name!,
      description: data.description!,
      type: data.type!,
      resource: data.resource,
      order: data.order!,
    };

    return this.data.contentResources.putAsync(resource).pipe(
      switchMap(() => {
        if (!file) return of(resource);

        return Utils.getFileAsync(file).pipe(
          switchMap((file) =>
            this.data.contentResources
              .putFileAsync(owner, parentId, resource.id, file)
              .pipe(map(() => resource))
          )
        );
      }),
      map(() => resource)
    );
  }
}
