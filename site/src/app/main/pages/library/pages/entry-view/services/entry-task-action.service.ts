import { EventEmitter, Injectable, inject } from '@angular/core';
import { EntryTaskService } from './entry-task.service';
import { SignalStore } from '@wbs/core/services';
import {
  LibraryEntry,
  LibraryEntryNode,
  LibraryEntryVersion,
} from '@wbs/core/models';
import { WbsNodeView } from '@wbs/core/view-models';
import { TaskCreateService } from '@wbs/main/components/task-create';
import { MetadataState } from '@wbs/main/states';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { EntryViewState } from '../states';

@Injectable()
export class EntryTaskActionService {
  private readonly store = inject(SignalStore);
  private readonly taskCreateService = inject(TaskCreateService);
  private readonly taskService = inject(EntryTaskService);
  readonly expandedKeysChanged = new EventEmitter<string[]>();

  private get entry(): LibraryEntry {
    return this.store.selectSnapshot(EntryViewState.entry)!;
  }

  private get version(): LibraryEntryVersion {
    return this.store.selectSnapshot(EntryViewState.version)!;
  }

  private get tasks(): LibraryEntryNode[] {
    return this.store.selectSnapshot(EntryViewState.tasks)!;
  }

  onAction(
    action: string,
    taskId: string,
    expandedKeys: string[],
    tree: WbsNodeView[]
  ): void {
    const entry = this.entry;
    const version = this.version;
    const tasks = this.tasks;
    let obs: Observable<any> | undefined;

    if (action === 'addSub') {
      const disciplines = this.store.selectSnapshot(MetadataState.disciplines);

      obs = this.taskCreateService.open(disciplines).pipe(
        switchMap((results) =>
          !results?.model
            ? of()
            : this.taskService.createTask(
                entry.owner,
                entry.id,
                version.version,
                taskId!,
                results,
                tasks
              )
        ),
        tap(() => {
          const keys = structuredClone(expandedKeys);
          if (!keys.includes(taskId!)) {
            keys.push(taskId!);
            this.expandedKeysChanged.emit(keys);
          }
        })
      );
    } else if (action === 'moveLeft') {
      obs = this.taskService.moveTaskLeft(
        entry.owner,
        entry.id,
        version.version,
        taskId!,
        tasks,
        tree
      );
    } else if (action === 'moveUp') {
      obs = this.taskService.moveTaskUp(
        entry.owner,
        entry.id,
        version.version,
        taskId!,
        tasks,
        tree
      );
    } else if (action === 'moveRight') {
      obs = this.taskService
        .moveTaskRight(
          entry.owner,
          entry.id,
          version.version,
          taskId!,
          tasks,
          tree
        )
        .pipe(
          tap((parentId) => {
            const keys = structuredClone(expandedKeys);
            if (!keys.includes(parentId!)) {
              keys.push(parentId!);
              this.expandedKeysChanged.emit(keys);
            }
          })
        );
    } else if (action === 'moveDown') {
      obs = this.taskService.moveTaskDown(
        entry.owner,
        entry.id,
        version.version,
        taskId!,
        tasks,
        tree
      );
    } else if (action === 'deleteTask') {
      obs = this.taskService.removeTask(
        entry.owner,
        entry.id,
        version.version,
        taskId!,
        tasks
      );
    } else if (action === 'cloneTask') {
      obs = this.taskService.cloneTask(
        entry.owner,
        entry.id,
        version.version,
        taskId!,
        tasks,
        tree
      );
    }
    if (obs) obs.subscribe();
  }
}
