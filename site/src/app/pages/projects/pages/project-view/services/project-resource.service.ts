import { computed, inject, Injectable } from '@angular/core';
import {
  PROJECT_CLAIMS,
  ContentResource,
  PROJECT_STATI,
} from '@wbs/core/models';
import { Utils } from '@wbs/core/services';
import { ProjectActivityService } from '@wbs/pages/projects/services';
import { Observable } from 'rxjs';
import { ProjectStore } from '../stores';
import { BaseProjectResourceService } from './base-project-resource.service';

@Injectable()
export class ProjectResourceService extends BaseProjectResourceService {
  private readonly activity = inject(ProjectActivityService);
  private readonly store = inject(ProjectStore);
  //
  //  Computed
  //
  readonly isPlanning = computed(
    () => this.store.project()!.status === PROJECT_STATI.PLANNING
  );
  readonly canAdd = computed(
    () =>
      this.isPlanning() &&
      Utils.contains(this.store.claims(), PROJECT_CLAIMS.RESOURCES.CREATE)
  );
  readonly canEdit = computed(
    () =>
      this.isPlanning() &&
      Utils.contains(this.store.claims(), PROJECT_CLAIMS.RESOURCES.UPDATE)
  );
  readonly canDelete = computed(
    () =>
      this.isPlanning() &&
      Utils.contains(this.store.claims(), PROJECT_CLAIMS.RESOURCES.DELETE)
  );

  protected getOwner(): string {
    return this.store.project()!.owner;
  }

  protected getParentId(): string {
    return this.store.project()!.id;
  }

  protected recordAddedActivity(record: ContentResource): Observable<void> {
    const project = this.store.project()!;

    return this.activity.resourceAdded(project.owner, project.id, record);
  }

  protected recordUpdatedActivity(record: ContentResource): Observable<void> {
    const project = this.store.project()!;

    return this.activity.resourceUpdated(project.owner, project.id, record);
  }

  protected recordRemovedActivity(record: ContentResource): Observable<void> {
    const project = this.store.project()!;

    return this.activity.resourceRemoved(project.owner, project.id, record);
  }

  protected recordReorderedActivity(recordIds: string[]): Observable<void> {
    const project = this.store.project()!;

    return this.activity.resourceReordered(
      project.owner,
      project.id,
      recordIds
    );
  }
}
