import { Injectable, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { IdService } from '@wbs/core/services';
import { AuthState } from '@wbs/main/states';
import { Observable } from 'rxjs';
import { LIBRARY_VERSION_ACTIONS } from '../models';
import { ProjectCategory } from '@wbs/core/models';

@Injectable()
export class EntryActivityService {
  private readonly data = inject(DataServiceFactory);
  private readonly store = inject(Store);

  entryCreated(entryId: string, type: string, title: string): Observable<void> {
    return this.save(entryId, 1, LIBRARY_VERSION_ACTIONS.ENTRY_CREATED, {
      type,
      title,
    });
  }

  versionCreated(entryId: string, version: number): Observable<void> {
    return this.save(entryId, version, LIBRARY_VERSION_ACTIONS.CREATED);
  }

  entryTitleChanged(
    entryId: string,
    version: number,
    from: string | undefined,
    to: string | undefined
  ): Observable<void> {
    return this.save(entryId, version, LIBRARY_VERSION_ACTIONS.TITLE_CHANGED, {
      from,
      to,
    });
  }

  entryDescriptionChanged(
    entryId: string,
    version: number,
    from: string,
    to: string
  ): Observable<void> {
    return this.save(
      entryId,
      version,
      LIBRARY_VERSION_ACTIONS.DESCRIPTION_CHANGED,
      { from, to }
    );
  }

  entryDisciplinesChanged(
    entryId: string,
    version: number,
    from: ProjectCategory[] | undefined,
    to: ProjectCategory[] | undefined
  ): Observable<void> {
    return this.save(
      entryId,
      version,
      LIBRARY_VERSION_ACTIONS.DISCIPLINES_CHANGED,
      {
        from,
        to,
      }
    );
  }

  entryUpload(entryId: string, version: number): Observable<void> {
    return this.save(entryId, version, LIBRARY_VERSION_ACTIONS.UPLOAD);
  }

  setupPhaseEntry(
    entryId: string,
    version: number,
    phaseTitle: string
  ): Observable<void> {
    return this.save(entryId, version, LIBRARY_VERSION_ACTIONS.SETUP_PHASE, {
      phaseTitle,
    });
  }

  setupTaskEntry(
    entryId: string,
    version: number,
    taskTitle: string
  ): Observable<void> {
    return this.save(entryId, version, LIBRARY_VERSION_ACTIONS.SETUP_TASK, {
      taskTitle,
    });
  }

  private save(
    topLevelId: string,
    versionId: number,
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
        versionId,
        userId: this.store.selectSnapshot(AuthState.userId)!,
      },
    ]);
  }
}
