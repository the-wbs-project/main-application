import { Injectable, inject } from '@angular/core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  LIBRARY_TASKS_REORDER_WAYS,
  LibraryEntryNode,
  WbsNode,
} from '@wbs/core/models';
import {
  IdService,
  Messages,
  WbsNodeService,
  sorter,
} from '@wbs/core/services';
import { LibraryVersionViewModel, TaskViewModel } from '@wbs/core/view-models';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import {
  EntryActivityService,
  EntryTaskActivityService,
} from '../../../services';
import { LibraryStore } from '../store';

@Injectable()
export class LibraryTaskService {
  private readonly versionActivity = inject(EntryActivityService);
  private readonly activity = inject(EntryTaskActivityService);
  private readonly data = inject(DataServiceFactory);
  private readonly messages = inject(Messages);
  private readonly store = inject(LibraryStore);

  private get owner(): string {
    return this.store.version()!.ownerId;
  }

  private get entryId(): string {
    return this.store.version()!.entryId;
  }

  private get version(): number {
    return this.versionObj.version;
  }

  private get versionObj(): LibraryVersionViewModel {
    return this.store.version()!;
  }

  private getTasks(): LibraryEntryNode[] {
    return structuredClone(this.store.tasks() ?? []);
  }

  private getTaskViewModel(id: string | undefined): TaskViewModel | undefined {
    if (id == undefined) return undefined;

    return this.store.viewModels()?.find((x) => x.id === id);
  }

  saveAsync(
    upserts: LibraryEntryNode[],
    removeIds: string[],
    saveMessage?: string
  ): Observable<void> {
    for (const t of upserts) t.lastModified = new Date();

    return this.data.libraryEntries
      .putTasksAsync(this.owner, this.entryId, this.version, upserts, removeIds)
      .pipe(
        tap(() => {
          if (saveMessage) this.messages.notify.success(saveMessage, false);
        }),
        tap(() => this.store.tasksChanged(upserts, removeIds))
      );
  }

  importTasks(tasks: LibraryEntryNode[]): Observable<unknown> {
    const version = this.versionObj;

    return this.saveAsync(tasks, []).pipe(
      switchMap(() =>
        this.versionActivity.importTasks(
          this.owner,
          this.entryId,
          version.version,
          tasks.map((x) => x.id)
        )
      )
    );
  }

  titleChangedAsync(taskId: string, title: string): Observable<void> {
    const task = this.getTasks().find((x) => x.id === taskId)!;
    const from = task.title;

    task.title = title;
    task.lastModified = new Date();

    return this.data.libraryEntries
      .putTasksAsync(this.owner, this.entryId, this.version, [task], [])
      .pipe(
        tap(() => this.store.tasksChanged([task])),
        switchMap(() =>
          this.activity.taskTitleChanged(
            this.owner,
            this.entryId,
            this.version,
            task.id,
            from,
            title
          )
        )
      );
  }

  descriptionChangedAsync(
    taskId: string,
    description: string
  ): Observable<void> {
    const task = this.getTasks().find((x) => x.id === taskId)!;
    const from = task.description;

    task.description = description;
    task.lastModified = new Date();

    return this.data.libraryEntries
      .putTasksAsync(this.owner, this.entryId, this.version, [task], [])
      .pipe(
        tap(() => this.store.tasksChanged([task])),
        switchMap(() =>
          this.activity.taskTitleChanged(
            this.owner,
            this.entryId,
            this.version,
            task.id,
            from,
            description
          )
        )
      );
  }

  verifyChanges(
    taskId: string,
    title: string,
    description: string | undefined,
    visiblity: string | undefined
  ): boolean {
    const task = this.getTasks().find((x) => x.id === taskId)!;

    return (
      task.title !== title ||
      task.description !== description ||
      task.visibility !== visiblity
    );
  }

  generalSaveAsync(
    taskId: string,
    title: string,
    description: string | undefined,
    visibility: string | undefined
  ): Observable<void> {
    const task = this.getTasks().find((x) => x.id === taskId)!;
    const activities: Observable<void>[] = [];

    if (task.title !== title) {
      const from = task.title;
      activities.push(
        this.activity.taskTitleChanged(
          this.owner,
          this.entryId,
          this.version,
          task.id,
          from,
          title
        )
      );

      task.title = title;
      task.lastModified = new Date();
    }
    if (task.description !== description) {
      const from = task.description;
      activities.push(
        this.activity.descriptionChanged(
          this.owner,
          this.entryId,
          this.version,
          task.id,
          from,
          description
        )
      );

      task.description = description;
      task.lastModified = new Date();
    }
    if (task.visibility !== visibility) {
      const from = task.visibility;
      activities.push(
        this.activity.visibilityChanged(
          this.owner,
          this.entryId,
          this.version,
          task.id,
          from,
          visibility
        )
      );

      task.visibility = visibility;
      task.lastModified = new Date();
    }
    if (activities.length === 0) return of();

    return this.data.libraryEntries
      .putTasksAsync(this.owner, this.entryId, this.version, [task], [])
      .pipe(
        tap(() => this.store.tasksChanged([task])),
        switchMap(() => forkJoin(activities)),
        map(() => {})
      );
  }

  createTask(
    taskId: string | undefined,
    results: Partial<WbsNode>
  ): Observable<string> {
    const tasks = this.getTasks();
    const siblings = tasks.filter((x) => x.parentId == taskId);

    const order =
      siblings.length === 0 ? 1 : Math.max(...siblings.map((x) => x.order)) + 1;

    const task: LibraryEntryNode = {
      id: IdService.generate(),
      parentId: taskId,
      order,
      lastModified: new Date(),
      title: results.title!,
      description: results.description,
      disciplineIds: results.disciplineIds,
    };
    return this.saveAsync([task], []).pipe(
      tap(() =>
        this.activity.taskCreated(
          this.owner,
          this.entryId,
          this.version,
          task.id,
          results.title!
        )
      ),
      map(() => task.id)
    );
  }

  addDisciplineAsync(taskId: string, disciplineId: string): Observable<void> {
    const tasks = this.getTasks();
    const task = tasks.find((x) => x.id === taskId)!;
    const from = [...(task.disciplineIds ?? [])];

    if (task.disciplineIds) {
      if (task.disciplineIds.indexOf(disciplineId) === -1)
        task.disciplineIds.push(disciplineId);
      else return of();
    } else task.disciplineIds = [disciplineId];

    task.lastModified = new Date();

    return this.saveAsync([task], []).pipe(
      tap(() =>
        this.activity.entryDisciplinesChanged(
          this.owner,
          this.entryId,
          this.version,
          taskId,
          from,
          task.disciplineIds
        )
      )
    );
  }

  removeDisciplineAsync(
    taskId: string,
    disciplineId: string
  ): Observable<void> {
    const tasks = this.getTasks();
    const task = tasks.find((x) => x.id === taskId)!;

    if (!task.disciplineIds) task.disciplineIds = [];

    const from = [...task.disciplineIds];

    const index = task.disciplineIds.indexOf(disciplineId);

    if (index === -1) return of();

    task.disciplineIds.splice(index, 1);
    task.lastModified = new Date();

    return this.saveAsync([task], []).pipe(
      tap(() =>
        this.activity.entryDisciplinesChanged(
          this.owner,
          this.entryId,
          this.version,
          taskId,
          from,
          task.disciplineIds
        )
      )
    );
  }

  removeDisciplinesFromAllTasksAsync(disciplineId: string[]): Observable<any> {
    const tasks = this.getTasks();
    const toSave: LibraryEntryNode[] = [];

    for (const task of tasks) {
      if (!task.disciplineIds) continue;

      const newList = task.disciplineIds.filter(
        (x) => !disciplineId.includes(x)
      );

      if (newList.length === task.disciplineIds.length) continue;

      task.disciplineIds = newList;
      toSave.push(task);
    }

    if (toSave.length === 0) return of('hello');

    return this.saveAsync(toSave, []).pipe();
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
      title: task.title + ' Clone',
      createdOn: now,
      lastModified: now,
    };

    return this.saveAsync([newNode], []).pipe(
      tap(() =>
        this.activity.taskCloned(
          this.owner,
          this.entryId,
          this.version,
          taskId,
          task.title,
          taskVm.levelText
        )
      )
    );
  }

  moveTaskLeft(taskId: string): Observable<boolean> {
    const tasks = this.getTasks();
    const task = tasks.find((x) => x.id === taskId);
    const parent = tasks.find((x) => x.id === task?.parentId);
    const taskVm = this.getTaskViewModel(taskId);

    if (!task || !parent || !taskVm) return of();

    const run = () => {
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

      task.order =
        Math.max(
          ...tasks
            .filter((x) => x.parentId === parent.parentId)
            .map((x) => x.order)
        ) + 1;
      task.parentId = parent.parentId;

      toSave.push(task);

      const parentVm = this.getTaskViewModel(task?.parentId);
      const tolevel = parentVm ? `${parentVm.levelText}.${taskVm.order}` : '??';

      return this.reordered(
        task.id,
        task.title,
        fromLevel,
        tolevel,
        LIBRARY_TASKS_REORDER_WAYS.MOVE_LEFT,
        toSave
      ).pipe(map(() => true));
    };
    if (parent.parentId == undefined) {
      return this.messages.confirm
        .show('General.Confirm', 'ReorderMessages.TaskToPhase')
        .pipe(switchMap((results) => (results ? run() : of(false))));
    } else {
      return run();
    }
  }

  moveTaskUp(taskId: string): Observable<boolean> {
    const tasks = this.getTasks();
    const task = tasks.find((x) => x.id === taskId)!;
    const task2 = tasks.find(
      (x) => x.parentId === task?.parentId && x.order === task.order - 1
    );
    if (!task || !task2) return of(false);

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
    ).pipe(map(() => true));
  }

  moveTaskRight(taskId: string): Observable<boolean> {
    const tasks = this.getTasks();
    const task = tasks.find((x) => x.id === taskId);
    const taskVm = this.getTaskViewModel(taskId);

    if (!task || !taskVm) return of();

    const run = () => {
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

      if (!newParent) return of(false);

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
      ).pipe(map(() => true));
    };

    if (task.parentId == undefined) {
      return this.messages.confirm
        .show('General.Confirm', 'ReorderMessages.PhaseToTask')
        .pipe(switchMap((results) => (results ? run() : of(false))));
    } else {
      return run();
    }
  }

  moveTaskDown(taskId: string): Observable<boolean> {
    const tasks = this.getTasks();
    const task = tasks.find((x) => x.id === taskId)!;
    const task2 = tasks.find(
      (x) => x.parentId === task?.parentId && x.order === task.order + 1
    );
    if (!task || !task2) return of();

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
    ).pipe(map(() => true));
  }

  reordered(
    taskId: string,
    title: string,
    from: string,
    to: string,
    how: string,
    tasks: LibraryEntryNode[]
  ): Observable<void> {
    for (const t of tasks) t.lastModified = new Date();

    return this.saveAsync(tasks, []).pipe(
      switchMap(() =>
        this.activity.taskReordered(
          this.owner,
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

  removeTask(taskId: string): Observable<boolean> {
    return this.messages.confirm
      .show('General.Confirm', 'Library.DeleteTask')
      .pipe(
        switchMap((answer) => {
          if (!answer) return of(false);

          const tasks = this.getTasks();
          const task = tasks.find((x) => x.id === taskId)!;
          const nodeIndex = tasks.findIndex((x) => x.id === taskId);
          const parentId = tasks[nodeIndex].parentId!;

          if (nodeIndex === -1) return of();

          tasks.splice(nodeIndex, 1);

          const upserts: LibraryEntryNode[] = [];
          const childrenIds = WbsNodeService.getChildrenIds(tasks, taskId);
          const siblings = tasks
            .filter((x) => x.parentId === parentId)
            .filter((x) => x.order > task.order)
            .sort((a, b) => sorter(a.order, b.order));

          let order = task.order;

          for (const sibling of siblings) {
            sibling.order = order;
            order++;

            upserts.push(sibling);
          }

          const removedIds: string[] = [taskId, ...childrenIds];

          return this.saveAsync(
            upserts,
            removedIds,
            'Library.TaskRemoved'
          ).pipe(map(() => true));
        })
      );
  }

  disciplinesChangedAsync(
    taskId: string,
    disciplineIds: string[]
  ): Observable<void> {
    const version = this.versionObj;
    const task = this.getTasks().find((x) => x.id === taskId);

    if (!task) return of();

    const from = task.disciplineIds;

    task.disciplineIds = disciplineIds;
    task.lastModified = new Date();

    return this.data.libraryEntries
      .putTasksAsync(
        version.ownerId,
        version.entryId,
        version.version,
        [task],
        []
      )
      .pipe(
        tap(() => this.store.tasksChanged([task])),
        switchMap(() =>
          this.activity.entryDisciplinesChanged(
            this.owner,
            version.entryId,
            version.version,
            taskId,
            from,
            disciplineIds
          )
        )
      );
  }

  visibilityChanged(
    taskId: string,
    visibility: 'public' | 'private'
  ): Observable<void> {
    const task = this.getTasks().find((x) => x.id === taskId)!;
    const from = task.description;

    task.visibility = visibility === 'public' ? undefined : 'private';
    task.lastModified = new Date();

    return this.data.libraryEntries
      .putTasksAsync(this.owner, this.entryId, this.version, [task], [])
      .pipe(
        tap(() => this.store.tasksChanged([task])),
        switchMap(() =>
          this.activity.visibilityChanged(
            this.owner,
            this.entryId,
            this.version,
            task.id,
            from,
            visibility
          )
        )
      );
  }
}
