import { EventEmitter, Injectable, inject } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { SignalStore } from '@wbs/core/services';
import { TaskCreationResults } from '@wbs/main/models';
import { Observable, of, switchMap, tap } from 'rxjs';
import { EntryTaskService } from './entry-task.service';

@Injectable()
export class EntryTaskActionService {
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
      console.log('test');
      return this.taskService.removeDisciplineAsync(taskId!, discipline);
    }
  }
}
