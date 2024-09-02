import { computed, inject, Injectable } from '@angular/core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { FileInfo } from '@progress/kendo-angular-upload';
import { RecordResourceEditorComponent } from '@wbs/components/record-resources/components/editor';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  PROJECT_CLAIMS,
  PROJECT_STATI,
  ResourceRecord,
} from '@wbs/core/models';
import { IdService, Messages, Utils } from '@wbs/core/services';
import { ProjectActivityService } from '@wbs/pages/projects/services';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ProjectStore } from '../stores';

@Injectable()
export class ProjectResourcesService {
  private readonly activity = inject(ProjectActivityService);
  private readonly data = inject(DataServiceFactory);
  private readonly dialogService = inject(DialogService);
  private readonly projectStore = inject(ProjectStore);
  private readonly messages = inject(Messages);
  //
  //  Computed
  //
  private readonly isPlanning = computed(
    () => this.projectStore.project()?.status === PROJECT_STATI.PLANNING
  );
  readonly canAdd = computed(
    () =>
      this.isPlanning() &&
      Utils.contains(
        this.projectStore.claims(),
        PROJECT_CLAIMS.RESOURCES.CREATE
      )
  );
  readonly canEdit = computed(
    () =>
      this.isPlanning() &&
      Utils.contains(
        this.projectStore.claims(),
        PROJECT_CLAIMS.RESOURCES.UPDATE
      )
  );
  readonly canDelete = computed(
    () =>
      this.isPlanning() &&
      Utils.contains(
        this.projectStore.claims(),
        PROJECT_CLAIMS.RESOURCES.DELETE
      )
  );

  getRecordsAsync(taskId?: string): Observable<ResourceRecord[]> {
    const project = this.projectStore.project()!;

    return this.data.projectResources.getAsync(
      project.owner,
      project.id,
      taskId
    );
  }

  launchAddAsync(
    taskId: string | undefined
  ): Observable<ResourceRecord | undefined> {
    const project = this.projectStore.project()!;

    return RecordResourceEditorComponent.launchAddAsync(
      this.dialogService
    ).pipe(
      switchMap((data) =>
        data.record == undefined
          ? of(undefined)
          : this.save(taskId, data.record, data.file).pipe(
              switchMap((newRecord) =>
                this.activity
                  .resourceAdded(project.owner, project.id, newRecord)
                  .pipe(map(() => newRecord))
              )
            )
      )
    );
  }

  editRecordAsync(
    taskId: string | undefined,
    record: ResourceRecord
  ): Observable<ResourceRecord | undefined> {
    const project = this.projectStore.project()!;

    return RecordResourceEditorComponent.launchEditAsync(
      this.dialogService,
      record
    ).pipe(
      switchMap((data) =>
        data.record == undefined
          ? of(undefined)
          : this.save(taskId, data.record, data.file).pipe(
              switchMap((newRecord) =>
                this.activity
                  .resourceUpdated(project.owner, project.id, newRecord)
                  .pipe(map(() => newRecord))
              )
            )
      )
    );
  }

  deleteRecordAsync(
    taskId: string | undefined,
    record: ResourceRecord
  ): Observable<boolean> {
    const project = this.projectStore.project()!;

    return this.messages.confirm
      .show('General.Confirm', 'Resources.DeleteResourceConfirm')
      .pipe(
        switchMap((answer) =>
          answer
            ? this.data.projectResources
                .deleteAsync(project.owner, project.id, taskId, record.id)
                .pipe(
                  switchMap(() =>
                    this.activity.resourceRemoved(
                      project.owner,
                      project.id,
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
    records: Partial<ResourceRecord>[]
  ): Observable<ResourceRecord[]> {
    const project = this.projectStore.project()!;
    let obs: Observable<ResourceRecord>[] = [];

    for (const record of records) {
      obs.push(this.save(taskId, record));
    }
    return forkJoin(obs).pipe(
      tap(() => this.messages.notify.success('Resources.ResourceSaved')),
      switchMap((records) =>
        this.activity
          .resourceReordered(
            project.owner,
            project.id,
            records.map((x) => x.id!)
          )
          .pipe(map(() => records))
      )
    );
  }

  getApiUrl(taskId?: string): string {
    const project = this.projectStore.project()!;
    const parts = ['/api', 'portfolio', project.owner, 'projects', project.id];

    if (taskId) parts.push('nodes', taskId);

    return parts.join('/');
  }

  private save(
    taskId: string | undefined,
    data: Partial<ResourceRecord>,
    file?: FileInfo
  ): Observable<ResourceRecord> {
    const project = this.projectStore.project()!;
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

    return this.data.projectResources
      .putAsync(project.owner, project.id, taskId, resource)
      .pipe(
        switchMap(() => {
          if (!file) return of(resource);

          return Utils.getFileAsync(file).pipe(
            switchMap((file) =>
              this.data.projectResources
                .putFileAsync(
                  project.owner,
                  project.id,
                  taskId,
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
