import { Injectable, inject } from '@angular/core';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  LIBRARY_TASKS_REORDER_WAYS,
  LibraryEntryNode,
  LibraryEntryVersion,
  ProjectCategory,
  TaskCreationResults,
} from '@wbs/core/models';
import {
  CategorySelectionService,
  IdService,
  Messages,
  Resources,
  Transformers,
  WbsNodeService,
} from '@wbs/core/services';
import { CategorySelection, WbsNodeView } from '@wbs/core/view-models';
import { EntryStore, MetadataStore } from '@wbs/store';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { EntryTaskActivityService } from './entry-task-activity.service';

@Injectable()
export class EntryTaskService {
  private readonly activity = inject(EntryTaskActivityService);
  private readonly categoryService = inject(CategorySelectionService);
  private readonly metadata = inject(MetadataStore);
  private readonly data = inject(DataServiceFactory);
  private readonly messages = inject(Messages);
  private readonly resources = inject(Resources);
  private readonly store = inject(EntryStore);
  private readonly transformers = inject(Transformers);

  private get owner(): string {
    return this.store.entry()!.owner;
  }

  private get entryId(): string {
    return this.store.entry()!.id;
  }

  private get version(): number {
    return this.versionObj.version;
  }

  private get versionObj(): LibraryEntryVersion {
    return this.store.version()!;
  }

  private getTasks(): LibraryEntryNode[] {
    return structuredClone(this.store.tasks() ?? []);
  }

  private getTaskViewModel(id: string | undefined): WbsNodeView | undefined {
    if (id == undefined) return undefined;

    return this.store.viewModels()?.find((x) => x.id === id);
  }

  saveAsync(
    upserts: LibraryEntryNode[],
    removeIds: string[],
    saveMessage?: string
  ): Observable<void> {
    return this.data.libraryEntryNodes
      .putAsync(this.owner, this.entryId, this.version, upserts, removeIds)
      .pipe(
        tap(() => {
          if (saveMessage) this.messages.notify.success(saveMessage, false);
        }),
        tap(() => this.store.tasksChanged(upserts, removeIds))
      );
  }

  titleChangedAsync(taskId: string, title: string): Observable<void> {
    const task = this.getTasks().find((x) => x.id === taskId)!;
    const from = task.title;

    task.title = title;

    return this.data.libraryEntryNodes
      .putAsync(this.owner, this.entryId, this.version, [task], [])
      .pipe(
        tap(() => this.store.tasksChanged([task])),
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

  descriptionChangedAsync(
    taskId: string,
    description: string
  ): Observable<void> {
    const task = this.getTasks().find((x) => x.id === taskId)!;
    const from = task.description;

    task.description = description;

    return this.data.libraryEntryNodes
      .putAsync(this.owner, this.entryId, this.version, [task], [])
      .pipe(
        tap(() => this.store.tasksChanged([task])),
        switchMap(() =>
          this.activity.taskTitleChanged(
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
    description: string | undefined
  ): boolean {
    const task = this.getTasks().find((x) => x.id === taskId)!;

    return task.title !== title || task.description !== description;
  }

  generalSaveAsync(
    taskId: string,
    title: string,
    description: string | undefined
  ): Observable<void> {
    const task = this.getTasks().find((x) => x.id === taskId)!;
    const activities: Observable<void>[] = [];

    if (task.title !== title) {
      const from = task.title;
      activities.push(
        this.activity.taskTitleChanged(
          this.entryId,
          this.version,
          task.id,
          from,
          title
        )
      );

      task.title = title;
    }
    if (task.description !== description) {
      const from = task.description;
      activities.push(
        this.activity.descriptionChanged(
          this.entryId,
          this.version,
          task.id,
          from,
          description
        )
      );

      task.description = description;
    }
    if (activities.length === 0) return of();

    return this.data.libraryEntryNodes
      .putAsync(this.owner, this.entryId, this.version, [task], [])
      .pipe(
        tap(() => this.store.tasksChanged([task])),
        switchMap(() => forkJoin(activities)),
        map(() => {})
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

  addDisciplineAsync(taskId: string, disciplineId: string): Observable<void> {
    const tasks = this.getTasks();
    const task = tasks.find((x) => x.id === taskId)!;
    const taskVm = this.getTaskViewModel(taskId)!;

    const from = [...(task.disciplineIds ?? [])];

    if (task.disciplineIds) {
      if (task.disciplineIds.indexOf(disciplineId) === -1)
        task.disciplineIds.push(disciplineId);
      else return of();
    } else task.disciplineIds = [disciplineId];

    taskVm.disciplines = task.disciplineIds;

    return this.saveAsync([task], []).pipe(
      tap(() =>
        this.activity.entryDisciplinesChanged(
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
    const taskVm = this.getTaskViewModel(taskId)!;

    if (!task.disciplineIds) task.disciplineIds = [];

    const from = [...task.disciplineIds];

    const index = task.disciplineIds.indexOf(disciplineId);

    if (index === -1) return of();

    task.disciplineIds.splice(index, 1);

    taskVm.disciplines = task.disciplineIds;

    return this.saveAsync([task], []).pipe(
      tap(() =>
        this.activity.entryDisciplinesChanged(
          this.entryId,
          this.version,
          taskId,
          from,
          task.disciplineIds
        )
      )
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
      tags: task.tags,
      title: task.title + ' Clone',
      createdOn: now,
      lastModified: now,
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
      );
    };
    if (parent.parentId == undefined) {
      return this.messages.confirm
        .show('General.Confirm', 'ReorderMessages.TaskToPhase')
        .pipe(switchMap((results) => (results ? run() : of())));
    } else {
      return run();
    }
  }

  moveTaskUp(taskId: string): Observable<void> {
    const tasks = this.getTasks();
    const task = tasks.find((x) => x.id === taskId)!;
    const task2 = tasks.find(
      (x) => x.parentId === task?.parentId && x.order === task.order - 1
    );
    if (!task || !task2) return of();

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
  }

  moveTaskRight(taskId: string): Observable<string | void> {
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
    };

    if (task.parentId == undefined) {
      return this.messages.confirm
        .show('General.Confirm', 'ReorderMessages.PhaseToTask')
        .pipe(switchMap((results) => (results ? run() : of())));
    } else {
      return run();
    }
  }

  moveTaskDown(taskId: string): Observable<void> {
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
    );
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

          tasks.splice(nodeIndex, 1);

          const childrenIds = WbsNodeService.getChildrenIds(tasks, taskId);
          const changedIds = this.transformers.nodes.phase.reorderer.run(
            parentId,
            tasks
          );

          const removedIds: string[] = [taskId, ...childrenIds];
          const upserts = tasks.filter((x) => changedIds.includes(x.id));

          return this.saveAsync(upserts, removedIds, 'Library.TaskRemoved');
        })
      );
  }

  savePhaseChangesAsync(phases: CategorySelection[]): Observable<void> {
    const tasks = this.getTasks();
    const phaseDefinitions = this.metadata.categories.phases;
    const existing: ProjectCategory[] = tasks
      .filter((x) => x.parentId == undefined)
      .sort((a, b) => a.order - b.order)
      .map(
        (x) =>
          x.phaseIdAssociation ?? {
            id: x.id,
            label: x.title,
            description: x.description,
          }
      );
    const results = this.categoryService.extract(phases, existing);
    const toRemoveIds: string[] = [];
    const upserts: LibraryEntryNode[] = [];
    //
    //  Now get all ids to remove
    //
    for (const id of results.removedIds) {
      const task = tasks.find(
        (x) => x.id === id || x.phaseIdAssociation === id
      );

      if (!task) continue;

      toRemoveIds.push(
        task.id,
        ...WbsNodeService.getChildrenIds(tasks, task.id)
      );
    }
    //
    //  Remove
    //
    for (const id of toRemoveIds) {
      const index = tasks.findIndex((x) => x.id === id);

      if (index > -1) tasks.splice(index, 1);
    }
    //
    //  Now  look through cats
    //
    for (let i = 0; i < results.categories.length; i++) {
      const cat = results.categories[i];
      const catId = typeof cat === 'string' ? cat : cat.id;
      let task = tasks.find(
        (x) => x.id === catId || x.phaseIdAssociation === catId
      );

      if (task) {
        if (task.order !== i + 1) {
          task.order = i + 1;
          upserts.push(task);
        }
      } else if (typeof cat === 'string') {
        const phase = phaseDefinitions.find((x) => x.id === cat)!;

        task = {
          id: IdService.generate(),
          phaseIdAssociation: cat,
          order: i + 1,
          lastModified: new Date(),
          title: this.resources.get(phase.label),
          description: phase.description
            ? this.resources.get(phase.description)
            : undefined,
        };
        tasks.push(task);
        upserts.push(task);
      } else {
        task = {
          id: cat.id,
          order: i + 1,
          lastModified: new Date(),
          title: cat.label,
          description: cat.description,
        };
        tasks.push(task);
        upserts.push(task);
      }
    }
    return this.saveAsync(upserts, toRemoveIds, 'Library.PhasesUpdated');
  }

  disciplinesChangedAsync(
    taskId: string,
    disciplineIds: string[]
  ): Observable<void> {
    const entry = this.store.entry()!;
    const version = this.store.version()!.version;
    const task = this.getTasks().find((x) => x.id === taskId);

    if (!task) return of();

    const from = task.disciplineIds;

    task.disciplineIds = disciplineIds;

    return this.data.libraryEntryNodes
      .putAsync(entry.owner, entry.id, version, [task], [])
      .pipe(
        tap(() => this.store.tasksChanged([task])),
        switchMap(() =>
          this.activity.entryDisciplinesChanged(
            entry.id,
            version,
            taskId,
            from,
            disciplineIds
          )
        )
      );
  }
}
