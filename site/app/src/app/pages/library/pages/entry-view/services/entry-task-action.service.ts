import { EventEmitter, Injectable, inject } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { DialogService } from '@progress/kendo-angular-dialog';
import { LibraryListModalComponent } from '@wbs/components/library-list-modal';
import { LibraryImportResults } from '@wbs/core/models';
import { SignalStore } from '@wbs/core/services';
import { EntryTaskService } from '@wbs/core/services/library';
import { TaskCreationResults } from '@wbs/main/models';
import { MembershipState } from '@wbs/main/states';
import { EntryStore } from '@wbs/store';
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
  private readonly store = inject(SignalStore);
  private readonly taskService = inject(EntryTaskService);

  readonly expandedKeysChanged = new EventEmitter<string[]>();

  createTask(
    data: TaskCreationResults,
    taskId: string,
    entryUrl: string[],
    expandedKeys: string[]
  ): void {
    this.taskService
      .createTask(taskId!, data)
      .pipe(
        tap(() => {
          const keys = structuredClone(expandedKeys);
          if (!keys.includes(taskId!)) {
            keys.push(taskId!);

            this.expandedKeysChanged.emit(keys);
          }
        }),
        switchMap((id) =>
          data.nav
            ? this.store.dispatch(new Navigate([...entryUrl, 'tasks', id]))
            : of()
        )
      )
      .subscribe();
  }

  onAction(
    action: string,
    urlPrefix: string[],
    taskId: string
  ): Observable<any> | void {
    if (action === 'viewTask') {
      return this.store.dispatch(
        new Navigate([...urlPrefix, 'tasks', taskId, 'about'])
      );
    } else if (action === 'moveLeft') {
      return this.taskService.moveTaskLeft(taskId!);
    } else if (action === 'moveUp') {
      return this.taskService.moveTaskUp(taskId!);
    } else if (action === 'moveRight') {
      return this.taskService.moveTaskRight(taskId!);
    } else if (action === 'moveDown') {
      return this.taskService.moveTaskDown(taskId!);
    } else if (action === 'deleteTask') {
      return this.taskService.removeTask(taskId!);
    } else if (action === 'cloneTask') {
      return this.taskService.cloneTask(taskId!);
    } else if (action.startsWith('addDiscipline|')) {
      const discipline = action.split('|')[1];

      return this.taskService.addDisciplineAsync(taskId!, discipline);
    } else if (action.startsWith('removeDiscipline|')) {
      const discipline = action.split('|')[1];

      return this.taskService.removeDisciplineAsync(taskId!, discipline);
    } else if (action === 'export') {
      this.creation.exportTaskToEntryAsync(taskId!);
    } else if (action.startsWith('import|')) {
      const direction = action.split('|')[1]!;
      const org = this.store.selectSnapshot(MembershipState.organization)!.name;
      const task = this.libraryStore.tasks()!.find((x) => x.id === taskId)!;
      const types: string[] =
        direction === 'right' || task.parentId != null
          ? ['task']
          : ['phase', 'task'];

      return LibraryListModalComponent.launchAsync(
        this.dialogService,
        org,
        'personal',
        types
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
