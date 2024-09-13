import { Injectable, inject } from '@angular/core';
import { DataServiceFactory } from '@wbs/core/data-services';
import { LIBRARY_ENTRY_TYPES } from '@wbs/core/models';
import { UserStore } from '@wbs/core/store';
import { Observable } from 'rxjs';
import { ExportResults } from './export-results.model';

@Injectable()
export class ExportToLibraryDialogService {
  private readonly data = inject(DataServiceFactory);
  private readonly userId = inject(UserStore).userId;

  export(
    type: string,
    owner: string,
    projectId: string,
    taskId: string | undefined,
    results: ExportResults
  ): Observable<string> {
    if (type === LIBRARY_ENTRY_TYPES.PROJECT) {
      return this.exportProject(owner, projectId, results);
    }
    if (type === LIBRARY_ENTRY_TYPES.PHASE) {
      return this.exportPhase(owner, projectId, taskId!, results);
    }
    if (type === LIBRARY_ENTRY_TYPES.TASK) {
      return this.exportTask(owner, projectId, taskId!, results);
    }
    throw new Error('Invalid type');
  }

  private exportProject(
    owner: string,
    projectId: string,
    results: ExportResults
  ): Observable<string> {
    return this.data.projects.exportProjectToLibraryAsync(owner, projectId, {
      author: this.userId()!,
      ...results,
    });
  }

  private exportPhase(
    owner: string,
    projectId: string,
    taskId: string,
    results: ExportResults
  ): Observable<string> {
    return this.data.projects.exportTaskToLibraryAsync(
      owner,
      projectId,
      taskId,
      {
        author: this.userId()!,
        includeResources: results.includeResources,
        visibility: results.visibility,
        title: results.title,
      }
    );
  }

  private exportTask(
    owner: string,
    projectId: string,
    taskId: string,
    results: ExportResults
  ): Observable<string> {
    return this.data.projects.exportTaskToLibraryAsync(
      owner,
      projectId,
      taskId,
      {
        author: this.userId()!,
        includeResources: results.includeResources,
        visibility: results.visibility,
        title: results.title,
      }
    );
  }
}
