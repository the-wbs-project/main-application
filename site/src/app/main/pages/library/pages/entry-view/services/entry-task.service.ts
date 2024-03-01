import { Injectable, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { LibraryEntryNode, LibraryEntryVersion } from '@wbs/core/models';
import { IdService, Messages } from '@wbs/core/services';
import { WbsNodeView } from '@wbs/core/view-models';
import { TaskCreationResults } from '@wbs/main/models';
import { Transformers } from '@wbs/main/services';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { TasksChanged, VersionChanged } from '../actions';
import { LIBRARY_TASKS_REORDER_WAYS } from '../models';
import { EntryViewState } from '../states';
import { EntryTaskActivityService } from './entry-task-activity.service';
import { EntryTaskRecorderService } from './entry-task-reorder.service';

@Injectable()
export class EntryTaskService {
  private readonly activity = inject(EntryTaskActivityService);
  private readonly data = inject(DataServiceFactory);
  private readonly messages = inject(Messages);
  private readonly store = inject(Store);
  private readonly transformers = inject(Transformers);
  private readonly reorder = inject(EntryTaskRecorderService);

  private get owner(): string {
    return this.store.selectSnapshot(EntryViewState.entry)!.owner;
  }

  private get entryId(): string {
    return this.store.selectSnapshot(EntryViewState.entry)!.id;
  }

  private get version(): number {
    return this.versionObj.version;
  }

  private get task(): LibraryEntryNode {
    return this.store.selectSnapshot(EntryViewState.task)!;
  }

  private get versionObj(): LibraryEntryVersion {
    return this.store.selectSnapshot(EntryViewState.version)!;
  }

  private getTasks(): LibraryEntryNode[] {
    return (
      structuredClone(this.store.selectSnapshot(EntryViewState.tasks)) ?? []
    );
  }

  private getTaskViewModel(id: string | undefined): WbsNodeView | undefined {
    if (id == undefined) return undefined;

    return this.store
      .selectSnapshot(EntryViewState.taskVms)
      ?.find((x) => x.id === id);
  }

  saveAsync(
    upserts: LibraryEntryNode[],
    removeIds: string[],
    saveMessage: string | undefined
  ): Observable<void> {
    return this.data.libraryEntryNodes
      .putAsync(this.owner, this.entryId, this.version, upserts, removeIds)
      .pipe(
        tap(() => {
          if (saveMessage) this.messages.notify.success(saveMessage, false);
        }),
        tap(() => this.store.dispatch(new TasksChanged(upserts, removeIds)))
      );
  }

  titleChangedAsync(title: string): Observable<void> {
    const task = structuredClone(this.task);
    const from = task.title;

    task.title = title;

    return this.data.libraryEntryNodes
      .putAsync(this.owner, this.entryId, this.version, [task], [])
      .pipe(
        tap(() => this.messages.notify.success('Library.TitleChanged')),
        switchMap(() => this.store.dispatch(new TasksChanged([task]))),
        switchMap(() =>
          this.activity.taskTitleChanged(
            this.entryId,
            this.version,
            task.id,
            from,
            title
          )
        )
      );
  }

  createTask(taskId: string, results: TaskCreationResults): Observable<string> {
    const tasks = this.getTasks();
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
      entryId: this.entryId,
      entryVersion: this.version,
      order,
      lastModified: new Date(),
      title: results.model.title!,
      description: results.model.description,
      disciplineIds: results.model.disciplineIds,
    };
    return this.saveAsync([task], [], 'Library.TaskAddedSuccess').pipe(
      tap(() =>
        this.activity.taskCreated(
          this.entryId,
          this.version,
          task.id,
          results.model.title!
        )
      ),
      map(() => task.id)
    );
  }

  cloneTask(taskId: string): Observable<void> {
    const tasks = this.getTasks();
    const task = tasks.find((x) => x.id === taskId);
    const taskVm = this.getTaskViewModel(taskId);
    const now = new Date();

    if (!task || !taskVm) return of();

    const order =
      Math.max(
        ...tasks.filter((x) => x.parentId === task.parentId).map((x) => x.order)
      ) + 1;

    const newNode: LibraryEntryNode = {
      id: IdService.generate(),
      order,
      parentId: task.parentId,
      description: task.description,
      disciplineIds: task.disciplineIds,
      removed: false,
      tags: task.tags,
      title: task.title + ' Clone',
      createdOn: now,
      lastModified: now,
      entryId: task.entryId,
      entryVersion: task.entryVersion,
    };

    return this.saveAsync([newNode], [], 'Library.TaskCloned').pipe(
      tap(() =>
        this.activity.taskCloned(
          this.entryId,
          this.version,
          taskId,
          task.title,
          taskVm.levelText
        )
      )
    );
  }

  moveTaskLeft(taskId: string): Observable<void> {
    const tasks = this.getTasks();
    const task = tasks.find((x) => x.id === taskId);
    const parent = tasks.find((x) => x.id === task?.parentId);
    const taskVm = this.getTaskViewModel(taskId);

    if (!task || !parent || !taskVm) return of();

    const toSave: LibraryEntryNode[] = [];
    const fromLevel = taskVm.levelText;
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
    const parentVm = this.getTaskViewModel(task?.parentId);
    const tolevel = parentVm ? `${parentVm.levelText}.${taskVm.order}` : '??';

    return this.reordered(
      task.id,
      task.title,
      fromLevel,
      tolevel,
      LIBRARY_TASKS_REORDER_WAYS.MOVE_LEFT,
      toSave
    );
  }

  moveTaskUp(taskId: string): Observable<void> {
    const tasks = this.getTasks();
    const task = tasks.find((x) => x.id === taskId)!;
    const task2 = tasks.find(
      (x) => x.parentId === task?.parentId && x.order === task.order - 1
    );
    if (!task || !task2) return of();

    const run = () => {
      const fromLevel = this.getTaskViewModel(taskId)!.levelText;
      const toLevel = this.getTaskViewModel(task2!.id)!.levelText;

      task.order--;
      task2.order++;

      return this.reordered(
        task.id,
        task.title,
        fromLevel,
        toLevel,
        LIBRARY_TASKS_REORDER_WAYS.MOVE_UP,
        [task, task2]
      );
    };

    if (task.parentId == null) {
      return this.messages.confirm
        .show('General.Confirm', 'Are you sure you want to move this phase?')
        .pipe(
          switchMap((answer) => {
            if (!answer) return of();

            const version = structuredClone(this.versionObj);
            const index = version.phases.findIndex(
              (x) => (typeof x === 'string' ? x : x.id) === taskId
            );
            if (index === -1) return of();

            const phaseObj = version.phases[index];
            version.phases.splice(index, 1);
            version.phases.splice(index - 1, 0, phaseObj);

            return this.saveVersion(version).pipe(switchMap(() => run()));
          })
        );
    }

    return run();
  }

  moveTaskRight(taskId: string): Observable<string> {
    const tasks = this.getTasks();
    const task = tasks.find((x) => x.id === taskId);
    const taskVm = this.getTaskViewModel(taskId);

    if (!task || !taskVm) return of();

    const fromLevel = taskVm.levelText;
    const oldSiblings = tasks.filter((x) => x.parentId === task.parentId);
    const toSave: LibraryEntryNode[] = [];
    //
    //  Find all current siblings which are lower in the order than task and bump them up.
    //
    let newParent = oldSiblings.find((x) => x.order === task.order - 1);

    for (const sibling of oldSiblings) {
      if (sibling.order <= task.order) continue;

      sibling.order--;
      toSave.push(sibling);
    }

    if (!newParent) return of();

    const newSiblings = tasks.filter((x) => x.parentId === newParent!.id);

    task.parentId = newParent.id;
    task.order =
      (newSiblings.length === 0
        ? 0
        : Math.max(...newSiblings.map((x) => x.order))) + 1;

    const newParentVm = this.getTaskViewModel(newParent!.id)!;
    const toLevel = `${newParentVm.levelText}.${task.order}`;

    return this.reordered(
      task.id,
      task.title,
      fromLevel,
      toLevel,
      LIBRARY_TASKS_REORDER_WAYS.MOVE_RIGHT,
      [task, ...toSave]
    ).pipe(map(() => task.parentId!));
  }

  moveTaskDown(taskId: string): Observable<void> {
    const tasks = this.getTasks();
    const task = tasks.find((x) => x.id === taskId)!;
    const task2 = tasks.find(
      (x) => x.parentId === task?.parentId && x.order === task.order + 1
    );
    if (!task || !task2) return of();

    const run = () => {
      const vm = this.getTaskViewModel(taskId)!;
      const vm2 = this.getTaskViewModel(task2.id)!;

      const from = vm.levelText;
      const to = vm2.levelText;

      task.order++;
      task2.order--;

      return this.reordered(
        task.id,
        task.title,
        from,
        to,
        LIBRARY_TASKS_REORDER_WAYS.MOVE_DOWN,
        [task, task2]
      );
    };

    if (task.parentId == null) {
      return this.messages.confirm
        .show('General.Confirm', 'Are you sure you want to move this phase?')
        .pipe(
          switchMap((answer) => {
            if (!answer) return of();

            const version = structuredClone(this.versionObj);
            const index = version.phases.findIndex(
              (x) => (typeof x === 'string' ? x : x.id) === taskId
            );
            if (index === -1) return of();

            const phaseObj = version.phases[index];
            version.phases.splice(index, 1);
            version.phases.splice(index + 1, 0, phaseObj);

            return this.saveVersion(version).pipe(switchMap(() => run()));
          })
        );
    }
    return run();
  }

  reordered(
    taskId: string,
    title: string,
    from: string,
    to: string,
    how: string,
    tasks: LibraryEntryNode[]
  ): Observable<void> {
    return this.saveAsync(tasks, [], 'Library.TaskReordered').pipe(
      switchMap(() =>
        this.activity.taskReordered(
          this.entryId,
          this.version,
          taskId,
          title,
          from,
          to,
          how
        )
      )
    );
  }

  removeTask(taskId: string): Observable<void> {
    return this.messages.confirm
      .show('General.Confirm', 'Library.DeleteTask')
      .pipe(
        switchMap((answer) => {
          if (!answer) return of();

          const tasks = this.getTasks();
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

          return this.saveAsync(upserts, removedIds, 'Library.TaskRemoved');

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
      );
  }

  private getChildrenIds(tasks: LibraryEntryNode[], taskId: string): string[] {
    const children: string[] = [];

    for (const task of tasks.filter((x) => x.parentId === taskId)) {
      children.push(task.id);
      children.push(...this.getChildrenIds(tasks, task.id));
    }
    return children;
  }

  private saveVersion(version: LibraryEntryVersion): Observable<void> {
    return this.data.libraryEntryVersions
      .putAsync(this.owner, version)
      .pipe(switchMap(() => this.store.dispatch(new VersionChanged(version))));
  }
}
