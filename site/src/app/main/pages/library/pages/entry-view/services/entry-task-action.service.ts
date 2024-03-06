import { EventEmitter, Injectable, inject } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { SignalStore } from '@wbs/core/services';
import { TaskCreationResults } from '@wbs/main/models';
import { Observable, map, of, switchMap, tap } from 'rxjs';
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

  onAction(action: string, urlPrefix: string[], taskId: string): void {
    let obs: Observable<any> | undefined;

    if (action === 'viewTask') {
      obs = this.store.dispatch(
        new Navigate([...urlPrefix, 'tasks', taskId, 'about'])
      );
    } else if (action === 'moveLeft') {
      obs = this.taskService.moveTaskLeft(taskId!);
    } else if (action === 'moveUp') {
      obs = this.taskService.moveTaskUp(taskId!);
    } else if (action === 'moveRight') {
      obs = this.taskService.moveTaskRight(taskId!);
    } else if (action === 'moveDown') {
      obs = this.taskService.moveTaskDown(taskId!);
    } else if (action === 'deleteTask') {
      obs = this.taskService.removeTask(taskId!);
    } else if (action === 'cloneTask') {
      obs = this.taskService.cloneTask(taskId!);
    }
    if (obs) obs.subscribe();
  }
}
