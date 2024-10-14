import { Injectable, inject } from '@angular/core';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  LIBRARY_VERSION_ACTIONS,
  ProjectCategory,
  ContentResource,
  User,
} from '@wbs/core/models';
import { Observable } from 'rxjs';

@Injectable()
export class EntryActivityService {
  private readonly data = inject(DataServiceFactory);

  entryCreated(
    owner: string,
    entryId: string,
    type: string,
    title: string
  ): Observable<void> {
    return this.save(owner, entryId, 1, LIBRARY_VERSION_ACTIONS.ENTRY_CREATED, {
      type,
      title,
    });
  }

  versionCreated(
    owner: string,
    entryId: string,
    version: number
  ): Observable<void> {
    return this.save(owner, entryId, version, LIBRARY_VERSION_ACTIONS.CREATED);
  }

  importTasks(
    ownerId: string,
    entryId: string,
    version: number,
    taskIds: string[]
  ): Observable<void> {
    return this.save(
      ownerId,
      entryId,
      version,
      LIBRARY_VERSION_ACTIONS.IMPORT_TASKS,
      {
        taskIds,
        count: taskIds.length,
      }
    );
  }

  entryTitleChanged(
    owner: string,
    entryId: string,
    version: number,
    from: string | undefined,
    to: string | undefined
  ): Observable<void> {
    return this.save(
      owner,
      entryId,
      version,
      LIBRARY_VERSION_ACTIONS.TITLE_CHANGED,
      {
        from,
        to,
      }
    );
  }

  cancelVersion(
    owner: string,
    entryId: string,
    version: number,
    title: string,
    reason: string
  ): Observable<void> {
    return this.save(
      owner,
      entryId,
      version,
      LIBRARY_VERSION_ACTIONS.CANCEL_VERSION,
      {
        title,
        reason,
      }
    );
  }

  entryDescriptionChanged(
    owner: string,
    entryId: string,
    version: number,
    from: string,
    to: string
  ): Observable<void> {
    return this.save(
      owner,
      entryId,
      version,
      LIBRARY_VERSION_ACTIONS.DESCRIPTION_CHANGED,
      { from, to }
    );
  }

  entryDisciplinesChanged(
    owner: string,
    entryId: string,
    version: number,
    from: ProjectCategory[] | undefined,
    to: ProjectCategory[] | undefined
  ): Observable<void> {
    return this.save(
      owner,
      entryId,
      version,
      LIBRARY_VERSION_ACTIONS.DISCIPLINES_CHANGED,
      {
        from,
        to,
      }
    );
  }

  contributorsChanged(
    owner: string,
    entryId: string,
    version: number,
    from: User[] | undefined,
    to: User[] | undefined
  ): Observable<void> {
    return this.save(
      owner,
      entryId,
      version,
      LIBRARY_VERSION_ACTIONS.CONTRIBUTORS_CHANGED,
      {
        from,
        to,
      }
    );
  }

  versionAliasChanged(
    owner: string,
    entryId: string,
    version: number,
    from: string | undefined,
    to: string | undefined
  ): Observable<void> {
    return this.save(
      owner,
      entryId,
      version,
      LIBRARY_VERSION_ACTIONS.VERSION_ALIAS_CHANGED,
      {
        from,
        to,
      }
    );
  }

  categoryChanged(
    owner: string,
    entryId: string,
    version: number,
    from: string | undefined,
    to: string | undefined
  ): Observable<void> {
    return this.save(
      owner,
      entryId,
      version,
      LIBRARY_VERSION_ACTIONS.CATEGORY_CHANGED,
      {
        from,
        to,
      }
    );
  }

  entryUpload(
    owner: string,
    entryId: string,
    version: number
  ): Observable<void> {
    return this.save(owner, entryId, version, LIBRARY_VERSION_ACTIONS.UPLOAD);
  }

  setupPhaseEntry(
    owner: string,
    entryId: string,
    version: number,
    phaseTitle: string
  ): Observable<void> {
    return this.save(
      owner,
      entryId,
      version,
      LIBRARY_VERSION_ACTIONS.SETUP_PHASE,
      {
        phaseTitle,
      }
    );
  }

  setupTaskEntry(
    owner: string,
    entryId: string,
    version: number,
    taskTitle: string
  ): Observable<void> {
    return this.save(
      owner,
      entryId,
      version,
      LIBRARY_VERSION_ACTIONS.SETUP_TASK,
      {
        taskTitle,
      }
    );
  }

  publishedVersion(
    owner: string,
    entryId: string,
    version: number
  ): Observable<void> {
    return this.save(
      owner,
      entryId,
      version,
      LIBRARY_VERSION_ACTIONS.PUBLISHED
    );
  }

  unpublishedVersion(
    owner: string,
    entryId: string,
    version: number
  ): Observable<void> {
    return this.save(
      owner,
      entryId,
      version,
      LIBRARY_VERSION_ACTIONS.UNPUBLISHED
    );
  }

  resourceAdded(
    owner: string,
    entryId: string,
    version: number,
    resource: ContentResource
  ): Observable<void> {
    return this.save(
      owner,
      entryId,
      version,
      LIBRARY_VERSION_ACTIONS.RESOURCE_ADDED,
      {
        resource,
      }
    );
  }

  resourceReordered(
    owner: string,
    entryId: string,
    version: number,
    ids: string[]
  ): Observable<void> {
    return this.save(
      owner,
      entryId,
      version,
      LIBRARY_VERSION_ACTIONS.RESOURCE_REORDERED,
      {
        ids,
      }
    );
  }

  resourceRemoved(
    owner: string,
    entryId: string,
    version: number,
    resource: ContentResource
  ): Observable<void> {
    return this.save(
      owner,
      entryId,
      version,
      LIBRARY_VERSION_ACTIONS.RESOURCE_REMOVED,
      {
        resource,
      }
    );
  }

  resourceUpdated(
    owner: string,
    entryId: string,
    version: number,
    resource: ContentResource
  ): Observable<void> {
    return this.save(
      owner,
      entryId,
      version,
      LIBRARY_VERSION_ACTIONS.RESOURCE_CHANGED,
      {
        resource,
      }
    );
  }

  private save(
    owner: string,
    topLevelId: string,
    versionId: number,
    action: string,
    data?: any
  ): Observable<void> {
    return this.data.activities.postAsync('library', owner, topLevelId, [
      {
        action,
        data,
        topLevelId,
        versionId,
      },
    ]);
  }
}
