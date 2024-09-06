import { computed, inject, Injectable } from '@angular/core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { FileInfo } from '@progress/kendo-angular-upload';
import { RecordResourceEditorComponent } from '@wbs/components/record-resources/components/editor';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  PROJECT_CLAIMS,
  PROJECT_STATI,
  ContentResource,
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

  getRecordsAsync(taskId?: string): Observable<ContentResource[]> {
    const project = this.projectStore.project()!;

    return this.data.contentResources.getAsync(
      project.owner,
      taskId ?? project.id
    );
  }

  launchAddAsync(
    taskId: string | undefined
  ): Observable<ContentResource | undefined> {
    const project = this.projectStore.project()!;
    const save: (vm: {
      record: Partial<ContentResource>;
      file?: FileInfo;
    }) => Observable<ContentResource> = (vm) => {
      return this.save(taskId, vm.record, vm.file).pipe(
        switchMap((newRecord) =>
          this.activity
            .resourceAdded(project.owner, project.id, newRecord)
            .pipe(map(() => newRecord))
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
    const project = this.projectStore.project()!;
    const save: (vm: {
      record: Partial<ContentResource>;
      file?: FileInfo;
    }) => Observable<ContentResource> = (vm) => {
      return this.save(taskId, vm.record, vm.file).pipe(
        switchMap((newRecord) =>
          this.activity
            .resourceUpdated(project.owner, project.id, newRecord)
            .pipe(map(() => newRecord))
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
    const project = this.projectStore.project()!;

    return this.messages.confirm
      .show('General.Confirm', 'Resources.DeleteResourceConfirm')
      .pipe(
        switchMap((answer) =>
          answer
            ? this.data.contentResources
                .deleteAsync(project.owner, taskId ?? project.id, record.id)
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
    records: Partial<ContentResource>[]
  ): Observable<ContentResource[]> {
    const project = this.projectStore.project()!;
    let obs: Observable<ContentResource>[] = [];

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

  private save(
    taskId: string | undefined,
    data: Partial<ContentResource>,
    file?: FileInfo
  ): Observable<ContentResource> {
    const project = this.projectStore.project()!;
    const resource: ContentResource = {
      id: data.id ?? IdService.generate(),
      ownerId: project.owner,
      parentId: taskId ?? project.id,
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
                project.owner,
                taskId ?? project.id,
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
