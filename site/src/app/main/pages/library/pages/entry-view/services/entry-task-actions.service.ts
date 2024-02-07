import { Injectable, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { LibraryEntryNode, ListItem } from '@wbs/core/models';
import { IdService, Messages } from '@wbs/core/services';
import { TaskCreateService } from '@wbs/main/components/task-create';
import { TaskCreationResults } from '@wbs/main/models';
import { Transformers } from '@wbs/main/services';
import { MetadataState } from '@wbs/main/states';
import { of, switchMap } from 'rxjs';
import { EntryTaskService } from './entry-task.service';

@Injectable()
export class EntryTaskActionsService {
  private readonly taskCreateService = inject(TaskCreateService);
  private readonly taskService = inject(EntryTaskService);
  private readonly store = inject(Store);
  private readonly messages = inject(Messages);
  private readonly transformers = inject(Transformers);

  run(
    action: string,
    entryId: string,
    entryVersion: number,
    tasks: LibraryEntryNode[],
    taskId: string | undefined
  ): void {
    if (action === 'addSub') {
      this.taskCreateService.open(this.disciplines()).subscribe((results) => {
        if (!results?.model) return;

        this.createTask(entryId, entryVersion, results, tasks, taskId!);
      });
    } else if (action === 'moveLeft') {
      this.moveTaskLeft(tasks, taskId!);
    } else if (action === 'moveUp') {
      this.moveTaskUp(tasks, taskId!);
    } else if (action === 'moveRight') {
      this.moveTaskRight(tasks, taskId!);
    } else if (action === 'moveDown') {
      this.moveTaskDown(tasks, taskId!);
    } else if (action === 'deleteTask') {
      this.removeTask(tasks, taskId!);
    }
  }

  private disciplines(): ListItem[] {
    return this.store.selectSnapshot(MetadataState.disciplines);
  }

  private createTask(
    entryId: string,
    entryVersion: number,
    results: TaskCreationResults,
    tasks: LibraryEntryNode[],
    taskId: string
  ): void {
    const siblings = tasks.filter((x) => x.parentId === taskId);

    const order =
      siblings.length === 0
        ? 1
        : Math.max(
            ...tasks.filter((x) => x.parentId === taskId).map((x) => x.order)
          ) + 1;

    const task: LibraryEntryNode = {
      id: IdService.generate(),
      parentId: taskId,
      entryId,
      entryVersion,
      order,
      lastModified: new Date(),
      title: results.model.title!,
      description: results.model.description,
      disciplineIds: results.model.disciplineIds,
    };
    this.taskService
      .saveAsync([task], [], 'Library.TaskAddedSuccess')
      .subscribe();
  }

  private moveTaskLeft(tasks: LibraryEntryNode[], taskId: string): void {
    tasks = structuredClone(tasks);
    const task = tasks.find((x) => x.id === taskId);
    const parent = tasks.find((x) => x.id === task?.parentId);

    if (!task || !parent) return;

    const toSave: LibraryEntryNode[] = [];
    //
    //  Renumber the old siblings
    //
    for (const sibling of tasks.filter((x) => x.parentId === parent.id)) {
      if (sibling.order <= task.order || sibling.id === task.id) continue;

      sibling.order--;
      toSave.push(sibling);
    }

    task.parentId = parent.parentId;
    task.order = parent.order + 1;

    toSave.push(task);
    //
    //  Renumber the new siblings
    //
    for (const sibling of tasks.filter((x) => x.parentId === parent.parentId)) {
      if (sibling.order <= parent.order || sibling.id === task.id) continue;

      sibling.order++;
      toSave.push(sibling);
    }

    this.taskService.saveAsync(toSave, [], 'Library.TaskReordered').subscribe();
  }

  private moveTaskUp(tasks: LibraryEntryNode[], taskId: string): void {
    tasks = structuredClone(tasks);
    const task = tasks.find((x) => x.id === taskId)!;
    const task2 = tasks.find(
      (x) => x.parentId === task?.parentId && x.order === task.order - 1
    );
    if (!task || !task2) return;

    task.order--;
    task2.order++;

    this.taskService
      .saveAsync([task, task2], [], 'Library.TaskReordered')
      .subscribe();
  }

  private moveTaskRight(tasks: LibraryEntryNode[], taskId: string): void {
    tasks = structuredClone(tasks);
    const task = tasks.find((x) => x.id === taskId);
    let newParent: LibraryEntryNode | undefined;

    if (!task) return;

    const oldSiblings = tasks.filter((x) => x.parentId === task.parentId);
    const toSave: LibraryEntryNode[] = [];
    //
    //  Find all current siblings which are lower in the order than task and bump them up.
    //
    for (const sibling of oldSiblings) {
      if (sibling.order === task.order - 1) {
        newParent = sibling;
        continue;
      }
      if (sibling.order <= task.order) continue;

      sibling.order--;
      toSave.push(sibling);
    }
    if (!newParent) return;

    const newSiblings = tasks.filter((x) => x.parentId === newParent?.id);

    task.parentId = newParent.id;
    task.order =
      (newSiblings.length === 0
        ? 0
        : Math.max(...newSiblings.map((x) => x.order))) + 1;

    this.taskService
      .saveAsync([...toSave, task], [], 'Library.TaskReordered')
      .subscribe();
  }

  private moveTaskDown(tasks: LibraryEntryNode[], taskId: string): void {
    tasks = structuredClone(tasks);
    const task = tasks.find((x) => x.id === taskId)!;
    const task2 = tasks.find(
      (x) => x.parentId === task?.parentId && x.order === task.order + 1
    );
    if (!task || !task2) return;

    task.order++;
    task2.order--;

    this.taskService
      .saveAsync([task, task2], [], 'Library.TaskReordered')
      .subscribe();
  }

  private removeTask(tasks: LibraryEntryNode[], taskId: string): void {
    this.messages.confirm
      .show('General.Confirm', 'Library.DeleteTask')
      .pipe(
        switchMap((answer) => {
          if (!answer) return of();

          tasks = structuredClone(tasks);
          const nodeIndex = tasks.findIndex((x) => x.id === taskId);
          const parentId = tasks[nodeIndex].parentId!;

          if (nodeIndex === -1) return of();

          tasks[nodeIndex].removed = true;

          let changedIds = this.transformers.nodes.phase.reorderer.run(
            parentId,
            tasks
          );

          const removedIds: string[] = [
            taskId,
            ...this.getChildrenIds(tasks, taskId),
          ];
          const upserts = tasks.filter((x) => changedIds.includes(x.id));

          return this.taskService.saveAsync(
            upserts,
            removedIds,
            'Library.TaskRemoved'
          );

          /*
          return this.data.projectNodes
            .putAsync(project.owner, project.id, [], removedIds)
            .pipe(
              map(() => ctx.patchState({ nodes })),
              tap(() => this.messaging.notify.success('Projects.TaskRemoved')),
              switchMap(() => ctx.dispatch(new RebuildNodeViews())),
              tap(() =>
                this.saveActivity({
                  action: TASK_ACTIONS.REMOVED,
                  data: {
                    title: nodes[nodeIndex].title,
                    reason: action.reason,
                  },
                  topLevelId: state.project!.id,
                  objectId: action.nodeId,
                })
              ),
              switchMap(() =>
                action.completedAction
                  ? ctx.dispatch(action.completedAction)
                  : of()
              )
            );*/
        })
      )
      .subscribe();
  }

  private getChildrenIds(tasks: LibraryEntryNode[], taskId: string): string[] {
    const children: string[] = [];

    for (const task of tasks.filter((x) => x.parentId === taskId)) {
      children.push(task.id);
      children.push(...this.getChildrenIds(tasks, task.id));
    }
    return children;
  }
}
