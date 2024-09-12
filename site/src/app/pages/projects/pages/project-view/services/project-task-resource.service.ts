import { computed, inject, Injectable } from '@angular/core';
import {
  PROJECT_CLAIMS,
  ContentResource,
  PROJECT_STATI,
} from '@wbs/core/models';
import { Utils } from '@wbs/core/services';
import { ProjectTaskViewModel } from '@wbs/core/view-models';
import { ProjectTaskActivityService } from '@wbs/pages/projects/services';
import { Observable } from 'rxjs';
import { ProjectStore } from '../stores';
import { BaseProjectResourceService } from './base-project-resource.service';

@Injectable()
export class ProjectTaskResourceService extends BaseProjectResourceService {
  private readonly activity = inject(ProjectTaskActivityService);
  private readonly store = inject(ProjectStore);
  private task?: ProjectTaskViewModel;
  //
  //  Computed
  //
  readonly isPlanning = computed(
    () => this.store.project()!.status === PROJECT_STATI.PLANNING
  );
  readonly canAdd = computed(
    () =>
      this.isPlanning() &&
      Utils.contains(this.store.claims(), [
        PROJECT_CLAIMS.RESOURCES.CREATE,
        PROJECT_CLAIMS.TASKS.UPDATE,
      ])
  );
  readonly canEdit = computed(
    () =>
      this.isPlanning() &&
      Utils.contains(this.store.claims(), [
        PROJECT_CLAIMS.RESOURCES.UPDATE,
        PROJECT_CLAIMS.TASKS.UPDATE,
      ])
  );
  readonly canDelete = computed(
    () =>
      this.isPlanning() &&
      Utils.contains(this.store.claims(), [
        PROJECT_CLAIMS.RESOURCES.DELETE,
        PROJECT_CLAIMS.TASKS.UPDATE,
      ])
  );

  protected getOwner(): string {
    return this.store.project()!.owner;
  }

  protected getParentId(): string {
    return this.task!.id;
  }

  protected recordAddedActivity(record: ContentResource): Observable<void> {
    const project = this.store.project()!;
    const task = this.task!;

    return this.activity.resourceAdded(
      project.owner,
      project.id,
      task.id,
      task.title,
      record
    );
  }

  protected recordUpdatedActivity(record: ContentResource): Observable<void> {
    const project = this.store.project()!;
    const task = this.task!;

    return this.activity.resourceUpdated(
      project.owner,
      project.id,
      task.id,
      task.title,
      record
    );
  }

  protected recordRemovedActivity(record: ContentResource): Observable<void> {
    const project = this.store.project()!;
    const task = this.task!;

    return this.activity.resourceRemoved(
      project.owner,
      project.id,
      task.id,
      task.title,
      record
    );
  }

  protected recordReorderedActivity(ids: string[]): Observable<void> {
    const project = this.store.project()!;
    const task = this.task!;

    return this.activity.resourceReordered(
      project.owner,
      project.id,
      task.id,
      task.title,
      ids
    );
  }

  setTask(task: ProjectTaskViewModel): void {
    this.task = task;
  }
}
