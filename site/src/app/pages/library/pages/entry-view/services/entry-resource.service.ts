import { Injectable } from '@angular/core';
import { FileInfo } from '@progress/kendo-angular-upload';
import { DataServiceFactory } from '@wbs/core/data-services';
import { ResourceRecord } from '@wbs/core/models';
import { IdService, Messages } from '@wbs/core/services';
import { Utils } from '@wbs/main/services';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

@Injectable()
export class EntryResourceService {
  constructor(
    private readonly data: DataServiceFactory,
    private readonly messages: Messages
  ) {}

  getRecordsAsync(
    owner: string,
    entryId: string,
    versionId: number,
    taskId?: string
  ): Observable<ResourceRecord[]> {
    return this.data.libraryEntryResources.getAsync(
      owner,
      entryId,
      versionId,
      taskId
    );
  }

  saveRecordsAsync(
    owner: string,
    entryId: string,
    versionId: number,
    taskId: string | undefined,
    records: Partial<ResourceRecord>[]
  ): Observable<ResourceRecord[]> {
    let obs: Observable<ResourceRecord>[] = [];

    //this.messages.block.show('.resource-editor', 'General.Saving');

    for (const record of records) {
      obs.push(this.save(owner, entryId, versionId, taskId, record));
    }
    return forkJoin(obs).pipe(
      tap(() => this.messages.notify.success('Resources.ResourceSaved'))
    );
  }

  uploadAndSaveAsync(
    owner: string,
    entryId: string,
    versionId: number,
    taskId: string | undefined,
    rawFile: FileInfo,
    data: Partial<ResourceRecord>
  ): Observable<ResourceRecord> {
    if (!data.id) data.id = IdService.generate();

    //this.messages.block.show('.resource-editor', 'General.Saving');

    return Utils.getFileAsync(rawFile).pipe(
      switchMap((file) =>
        this.data.resourceFiles.uploadAsync(owner, data.id!, file)
      ),
      switchMap(() => this.save(owner, entryId, versionId, taskId, data)),
      tap(() => this.messages.notify.success('Resources.ResourceSaved'))
    );
  }

  private save(
    owner: string,
    entryId: string,
    versionId: number,
    taskId: string | undefined,
    data: Partial<ResourceRecord>
  ): Observable<ResourceRecord> {
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
      .putAsync(owner, entryId, versionId, taskId, resource)
      .pipe(map(() => resource));
  }
}
