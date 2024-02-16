import { Injectable, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { IdService } from '@wbs/core/services';
import { AuthState } from '@wbs/main/states';
import { Observable } from 'rxjs';
import { LIBRARY_TASKS_ACTIONS } from '../models';

@Injectable()
export class EntryTaskActivityService {
  private readonly data = inject(DataServiceFactory);
  private readonly store = inject(Store);

  taskCreated(
    entryId: string,
    version: number,
    taskId: string,
    title: string
  ): Observable<void> {
    return this.save(entryId, version, taskId, LIBRARY_TASKS_ACTIONS.CREATED, {
      title,
    });
  }

  taskCloned(
    entryId: string,
    version: number,
    taskId: string,
    title: string,
    level: string
  ): Observable<void> {
    return this.save(entryId, version, taskId, LIBRARY_TASKS_ACTIONS.CLONED, {
      title,
      level,
    });
  }

  taskReordered(
    entryId: string,
    version: number,
    taskId: string,
    title: string,
    from: string,
    to: string,
    how: string
  ): Observable<void> {
    return this.save(
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
    entryId: string,
    version: number,
    taskId: string,
    from: string,
    to: string
  ): Observable<void> {
    return this.save(
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
    entryId: string,
    version: number,
    taskId: string,
    from: string | undefined,
    to: string | undefined
  ): Observable<void> {
    return this.save(
      entryId,
      version,
      taskId,
      LIBRARY_TASKS_ACTIONS.DESCRIPTION_CHANGED,
      { from, to }
    );
  }

  taskRemoved(
    entryId: string,
    version: number,
    taskId: string,
    title: string,
    reason: string
  ): Observable<void> {
    return this.save(entryId, version, taskId, LIBRARY_TASKS_ACTIONS.REMOVED, {
      title,
      reason,
    });
  }

  private save(
    topLevelId: string,
    versionId: number,
    objectId: string,
    action: string,
    data?: any
  ): Observable<void> {
    return this.data.activities.saveLibraryEntryAsync([
      {
        id: IdService.generate(),
        timestamp: new Date(),
        action,
        data,
        topLevelId,
        objectId,
        versionId,
        userId: this.store.selectSnapshot(AuthState.userId)!,
      },
    ]);
  }
}
