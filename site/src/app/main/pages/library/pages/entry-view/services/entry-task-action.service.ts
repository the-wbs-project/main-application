import { EventEmitter, Injectable, inject } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { SignalStore } from '@wbs/core/services';
import {
  LibraryEntry,
  LibraryEntryNode,
  LibraryEntryVersion,
} from '@wbs/core/models';
import { WbsNodeView } from '@wbs/core/view-models';
import { MembershipState, MetadataState } from '@wbs/main/states';
import { Observable, of } from 'rxjs';
import { filter, first, switchMap, tap } from 'rxjs/operators';
import { EntryViewState } from '../states';
import { EntryTaskService } from './entry-task.service';
import { TaskCreateComponent } from '@wbs/main/components/task-create';
import { TaskCreationResults } from '@wbs/main/models';

@Injectable()
export class EntryTaskActionService {
  private readonly store = inject(SignalStore);
  private readonly taskService = inject(EntryTaskService);
  private createComponent?: TaskCreateComponent;

  readonly expandedKeysChanged = new EventEmitter<string[]>();

  private get org(): string {
    return this.store.selectSnapshot(MembershipState.organization)!.name;
  }

  private get entry(): LibraryEntry {
    return this.store.selectSnapshot(EntryViewState.entry)!;
  }

  private get version(): LibraryEntryVersion {
    return this.store.selectSnapshot(EntryViewState.version)!;
  }

  private get tasks(): LibraryEntryNode[] {
    return this.store.selectSnapshot(EntryViewState.tasks)!;
  }

  createTask(
    data: TaskCreationResults,
    taskId: string,
    expandedKeys: string[]
  ): void {
    const entry = this.entry;
    const version = this.version;
    const tasks = this.tasks;

    this.taskService
      .createTask(entry.owner, entry.id, version.version, taskId!, data, tasks)
      .subscribe(() => {
        const keys = structuredClone(expandedKeys);
        if (!keys.includes(taskId!)) {
          keys.push(taskId!);

          this.expandedKeysChanged.emit(keys);
        }
      });
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

    if (action === 'viewTask') {
      obs = this.store.dispatch(
        new Navigate([
          this.org,
          'library',
          'view',
          entry.id,
          version.version,
          'tasks',
          taskId,
          'about',
        ])
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
      const sub = this.taskService
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
