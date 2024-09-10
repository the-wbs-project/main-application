import { Injectable, inject } from '@angular/core';
import { DataServiceFactory } from '@wbs/core/data-services';
import { LIBRARY_TASKS_ACTIONS, ContentResource } from '@wbs/core/models';
import { IdService } from '@wbs/core/services';
import { UserStore } from '@wbs/core/store';
import { Observable } from 'rxjs';

@Injectable()
export class EntryTaskActivityService {
  private readonly data = inject(DataServiceFactory);
  private readonly userId = inject(UserStore).userId;

  taskCreated(
    ownerId: string,
    entryId: string,
    version: number,
    taskId: string,
    title: string
  ): Observable<void> {
    return this.save(
      ownerId,
      entryId,
      version,
      taskId,
      LIBRARY_TASKS_ACTIONS.CREATED,
      {
        title,
      }
    );
  }

  taskTitleChanged(
    ownerId: string,
    entryId: string,
    version: number,
    taskId: string,
    from: string | undefined,
    to: string | undefined
  ): Observable<void> {
    return this.save(
      ownerId,
      entryId,
      version,
      taskId,
      LIBRARY_TASKS_ACTIONS.TITLE_CHANGED,
      {
        from,
        to,
      }
    );
  }

  descriptionTitleChanged(
    ownerId: string,
    entryId: string,
    version: number,
    taskId: string,
    from: string | undefined,
    to: string | undefined
  ): Observable<void> {
    return this.save(
      ownerId,
      entryId,
      version,
      taskId,
      LIBRARY_TASKS_ACTIONS.DESCRIPTION_CHANGED,
      {
        from,
        to,
      }
    );
  }

  taskCloned(
    ownerId: string,
    entryId: string,
    version: number,
    taskId: string,
    title: string,
    level: string
  ): Observable<void> {
    return this.save(
      ownerId,
      entryId,
      version,
      taskId,
      LIBRARY_TASKS_ACTIONS.CLONED,
      {
        title,
        level,
      }
    );
  }

  taskReordered(
    ownerId: string,
    entryId: string,
    version: number,
    taskId: string,
    title: string,
    from: string,
    to: string,
    how: string
  ): Observable<void> {
    return this.save(
      ownerId,
      entryId,
      version,
      taskId,
      LIBRARY_TASKS_ACTIONS.REORDERED,
      {
        title,
        from,
        to,
        how,
      }
    );
  }

  titleChanged(
    ownerId: string,
    entryId: string,
    version: number,
    taskId: string,
    from: string,
    to: string
  ): Observable<void> {
    return this.save(
      ownerId,
      entryId,
      version,
      taskId,
      LIBRARY_TASKS_ACTIONS.TITLE_CHANGED,
      {
        from,
        to,
      }
    );
  }

  descriptionChanged(
    ownerId: string,
    entryId: string,
    version: number,
    taskId: string,
    from: string | undefined,
    to: string | undefined
  ): Observable<void> {
    return this.save(
      ownerId,
      entryId,
      version,
      taskId,
      LIBRARY_TASKS_ACTIONS.DESCRIPTION_CHANGED,
      { from, to }
    );
  }

  visibilityChanged(
    ownerId: string,
    entryId: string,
    version: number,
    taskId: string,
    from: string | undefined,
    to: string | undefined
  ): Observable<void> {
    return this.save(
      ownerId,
      entryId,
      version,
      taskId,
      LIBRARY_TASKS_ACTIONS.VISIBILITY_CHANGED,
      { from, to }
    );
  }

  taskRemoved(
    ownerId: string,
    entryId: string,
    version: number,
    taskId: string,
    title: string,
    reason: string
  ): Observable<void> {
    return this.save(
      ownerId,
      entryId,
      version,
      taskId,
      LIBRARY_TASKS_ACTIONS.REMOVED,
      {
        title,
        reason,
      }
    );
  }

  entryDisciplinesChanged(
    ownerId: string,
    entryId: string,
    version: number,
    taskId: string,
    from: string[] | undefined,
    to: string[] | undefined
  ): Observable<void> {
    return this.save(
      ownerId,
      entryId,
      version,
      taskId,
      LIBRARY_TASKS_ACTIONS.DISCIPLINES_CHANGED,
      {
        from,
        to,
      }
    );
  }

  resourceAdded(
    ownerId: string,
    entryId: string,
    version: number,
    taskId: string,
    resource: ContentResource
  ): Observable<void> {
    return this.save(
      ownerId,
      entryId,
      version,
      taskId,
      LIBRARY_TASKS_ACTIONS.RESOURCE_ADDED,
      {
        resource,
      }
    );
  }

  resourceReordered(
    ownerId: string,
    entryId: string,
    version: number,
    taskId: string,
    ids: string[]
  ): Observable<void> {
    return this.save(
      ownerId,
      entryId,
      version,
      taskId,
      LIBRARY_TASKS_ACTIONS.RESOURCE_REORDERED,
      {
        ids,
      }
    );
  }

  resourceRemoved(
    ownerId: string,
    entryId: string,
    version: number,
    taskId: string,
    resource: ContentResource
  ): Observable<void> {
    return this.save(
      ownerId,
      entryId,
      version,
      taskId,
      LIBRARY_TASKS_ACTIONS.RESOURCE_REMOVED,
      {
        resource,
      }
    );
  }

  resourceUpdated(
    ownerId: string,
    entryId: string,
    version: number,
    taskId: string,
    resource: ContentResource
  ): Observable<void> {
    return this.save(
      ownerId,
      entryId,
      version,
      taskId,
      LIBRARY_TASKS_ACTIONS.RESOURCE_CHANGED,
      {
        resource,
      }
    );
  }

  private save(
    ownerId: string,
    topLevelId: string,
    versionId: number,
    objectId: string,
    action: string,
    data?: any
  ): Observable<void> {
    return this.data.activities.postAsync('library', ownerId, this.userId()!, [
      {
        action,
        data,
        topLevelId,
        objectId,
        versionId,
      },
    ]);
  }
}
