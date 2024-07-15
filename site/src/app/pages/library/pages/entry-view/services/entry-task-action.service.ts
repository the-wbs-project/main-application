import { Injectable, inject } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { DialogService } from '@progress/kendo-angular-dialog';
import { LibraryListModalComponent } from '@wbs/components/library/list-modal';
import { TaskCreateComponent } from '@wbs/components/task-create';
import { LibraryImportResults, TaskCreationResults } from '@wbs/core/models';
import { SignalStore, TreeService } from '@wbs/core/services';
import { EntryTaskService } from '@wbs/core/services/library';
import { EntryStore, MembershipStore, UserStore } from '@wbs/core/store';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { EntryCreationService } from '../../../services';
import { LibraryImportProcessorService } from './library-import-processor.service';

@Injectable()
export class EntryTaskActionService {
  private readonly creation = inject(EntryCreationService);
  private readonly dialogService = inject(DialogService);
  private readonly importProcessor = inject(LibraryImportProcessorService);
  private readonly libraryStore = inject(EntryStore);
  private readonly membership = inject(MembershipStore);
  private readonly store = inject(SignalStore);
  private readonly taskService = inject(EntryTaskService);
  private readonly userId = inject(UserStore).userId;

  onAction(
    action: string,
    urlPrefix: string[],
    taskId: string | undefined,
    treeService: TreeService
  ): Observable<any> | void {
    if (action === 'addSub') {
      const disciplines = this.libraryStore.version()!.disciplines;

      return TaskCreateComponent.launchAsync(
        this.dialogService,
        disciplines
      ).pipe(
        switchMap((results: TaskCreationResults | undefined) =>
          !results
            ? of(false)
            : this.createTask(results, taskId, urlPrefix, treeService)
        )
      );
    } else if (taskId) {
      if (action === 'viewTask') {
        return this.store.dispatch(
          new Navigate([...urlPrefix, 'tasks', taskId, 'about'])
        );
      } else if (action === 'moveLeft') {
        return this.taskService.moveTaskLeft(taskId);
      } else if (action === 'moveUp') {
        return this.taskService.moveTaskUp(taskId);
      } else if (action === 'moveRight') {
        return this.taskService.moveTaskRight(taskId);
      } else if (action === 'moveDown') {
        return this.taskService.moveTaskDown(taskId);
      } else if (action === 'deleteTask') {
        return this.taskService.removeTask(taskId);
      } else if (action === 'cloneTask') {
        return this.taskService.cloneTask(taskId);
      } else if (action.startsWith('addDiscipline|')) {
        const discipline = action.split('|')[1];

        return this.taskService.addDisciplineAsync(taskId, discipline);
      } else if (action.startsWith('removeDiscipline|')) {
        const discipline = action.split('|')[1];

        return this.taskService.removeDisciplineAsync(taskId, discipline);
      } else if (action === 'export') {
        this.creation.exportTaskToEntryAsync(taskId);
      } else if (action.startsWith('import|')) {
        const direction = action.split('|')[1]!;

        return LibraryListModalComponent.launchAsync(
          this.dialogService,
          this.membership.membership()!.name,
          this.userId()!,
          'personal'
        ).pipe(
          switchMap((results: LibraryImportResults | undefined) =>
            !results
              ? of(false)
              : this.importProcessor
                  .importAsync(taskId, direction, results)
                  .pipe(map(() => true))
          )
        );
      }
    }
  }

  private createTask(
    data: TaskCreationResults,
    taskId: string | undefined,
    entryUrl: string[],
    treeService: TreeService
  ): Observable<boolean> {
    return this.taskService.createTask(taskId, data).pipe(
      tap(() => treeService.verifyExpanded(taskId)),
      switchMap((id) =>
        data.nav
          ? this.store
              .dispatch(new Navigate([...entryUrl, 'tasks', id]))
              .pipe(map(() => false))
          : of(true)
      )
    );
  }
}
