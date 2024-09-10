import { inject, Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { ProjectNode, RebuildResults } from '@wbs/core/models';
import { IdService, Transformers, WbsNodeService } from '@wbs/core/services';
import {
  CategoryViewModel,
  ProjectTaskViewModel,
  ProjectViewModel,
} from '@wbs/core/view-models';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ProjectTaskActivityService } from '../../../services';
import { ProjectStore } from '../stores';

@Injectable()
export class ProjectTaskService {
  private readonly activity = inject(ProjectTaskActivityService);
  private readonly data = inject(DataServiceFactory);
  private readonly wbsService = inject(WbsNodeService);
  protected readonly projectStore = inject(ProjectStore);
  protected readonly store = inject(Store);
  protected readonly transformers = inject(Transformers);

  remove(taskId: string, reason: string): Observable<unknown> {
    const project = this.getProject();
    const tasks = this.getTasks() ?? [];
    const taskIndex = tasks.findIndex((x) => x.id === taskId);

    if (taskIndex === -1) return of('');

    const task = tasks[taskIndex];
    const toRemove = [taskId, ...task.childrenIds];

    tasks.splice(taskIndex, 1);

    const changedIds = this.transformers.nodes.phase.reorderer.run(
      task.parentId,
      tasks
    );

    const upserts = tasks.filter((x) => changedIds.includes(x.id));

    return this.saveTaskVms(project, upserts, toRemove).pipe(
      switchMap(() =>
        this.activity.removeTask(
          project.owner,
          project.id,
          taskId,
          task.title,
          reason
        )
      )
    );
  }

  removeDisciplinesFromTasks(removedIds: string[]): Observable<any> {
    const project = this.getProject();
    const tasks = this.getTasks();
    const toSave: ProjectTaskViewModel[] = [];

    for (const task of tasks) {
      if (!task.disciplines) continue;

      let newList = task.disciplines.filter((x) => !removedIds.includes(x.id));

      if (task.disciplines.length === newList.length) continue;

      task.disciplines = newList;
      toSave.push(task);
    }

    return this.saveTaskVms(project, toSave);
  }

  changeDisciplines(
    taskId: string,
    disciplines: CategoryViewModel[]
  ): Observable<unknown> {
    const project = this.getProject();
    const task = this.getTasks()?.find((x) => x.id === taskId);

    if (!task) return of('');

    const from = task.disciplines.map((x) => x.id);
    const to = disciplines.map((x) => x.id);

    task.disciplines = disciplines;

    return this.saveTaskVms(project, [task]).pipe(
      switchMap(() =>
        this.activity.changeDisciplines(
          project.owner,
          project.id,
          taskId,
          task.title,
          from,
          to
        )
      )
    );
  }

  cloneTask(nodeId: string): Observable<unknown> {
    const project = this.getProject();
    const tasks = this.getTasks();
    const task = tasks.find((x) => x.id === nodeId);
    const now = new Date();

    if (!task) return of('');

    const order =
      Math.max(
        ...tasks
          .filter((x) => x.parentId === task?.parentId)
          .map((x) => x.order)
      ) + 1;

    const newNode: ProjectNode = {
      id: IdService.generate(),
      order,
      projectId: project.id,
      parentId: task.parentId,
      description: task.description,
      disciplineIds: task.disciplines.map((x) => x.id),
      title: task.title + ' Clone',
      createdOn: now,
      lastModified: now,
      absFlag: null,
    };

    return this.saveTasks(project, [newNode]).pipe(
      switchMap(() =>
        this.activity.cloneTask(
          project.owner,
          project.id,
          nodeId,
          task.title,
          task.levelText
        )
      )
    );
  }

  moveTaskDown(taskId: string): Observable<unknown> {
    const tasks = this.getTasks();
    const [task1, task2] = this.wbsService.moveTaskDown(tasks, taskId);

    if (!task1 || !task2) return of('');

    return this.saveReordered(task1.levelText, task1, [task2]);
  }

  moveTaskLeft(taskId: string): Observable<unknown> {
    const tasks = this.getTasks();
    let results = this.wbsService.moveTaskLeft(tasks, taskId);

    if (results.length === 0) return of('');

    const task = results[0];
    const toSave = results.slice(1);

    return this.saveReordered(task.levelText, task, toSave);
  }

  moveTaskRight(taskId: string): Observable<unknown> {
    const tasks = this.getTasks();
    let results = this.wbsService.moveTaskRight(tasks, taskId);

    if (results.length === 0) return of('');

    const task = results[0];
    const toSave = results.slice(1);

    return this.saveReordered(task.levelText, task, toSave);
  }

  moveTaskUp(taskId: string): Observable<unknown> {
    const tasks = this.getTasks();
    const [task1, task2] = this.wbsService.moveTaskUp(tasks, taskId);

    if (!task1 || !task2) return of('');

    return this.saveReordered(task1.levelText, task1, [task2]);
  }

  treeReordered(
    draggedId: string,
    results: RebuildResults
  ): Observable<unknown> {
    const upserts: ProjectTaskViewModel[] = [];
    const tasks = this.getTasks();
    const taskVm = tasks.find((x) => x.id === draggedId);

    for (const id of results.changedIds) {
      const vm = results.rows.find((x) => x.id === id)!;
      const model = tasks.find((x) => x.id === id)!;

      model.order = vm.order;
      model.parentId = vm.parentId;

      upserts.push(model);
    }

    if (upserts.length === 0) return of();

    return this.saveReordered(
      taskVm!.levelText,
      upserts.find((x) => x.id === draggedId)!,
      upserts.filter((x) => x.id !== draggedId)
    );
  }

  createTask(
    parentId: string | undefined,
    title: string,
    description?: string,
    disciplineIds?: string[]
  ): Observable<unknown> {
    const tasks = this.getTasks();
    const ts = new Date();
    const siblings = tasks.filter((x) => x.parentId == parentId) ?? [];
    let order =
      siblings.length === 0 ? 1 : Math.max(...siblings.map((x) => x.order)) + 1;

    const task: ProjectNode = {
      id: IdService.generate(),
      projectId: this.getProject().id,
      parentId,
      title,
      description,
      disciplineIds,
      order,
      absFlag: null,
      lastModified: new Date(),
    };

    return this.saveTasks(this.getProject(), [task]).pipe(
      switchMap(() =>
        this.activity.createTask(
          this.getProject().owner,
          this.getProject().id,
          task.id,
          task.title
        )
      )
    );

    //this.messaging.notify.success('Projects.TaskCreated');
  }

  changeTaskTitle(taskId: string, title: string): Observable<unknown> {
    const project = this.getProject();
    const tasks = this.getTasks();
    const task = tasks.find((x) => x.id === taskId)!;
    const from = task.title;

    task.title = title;

    return this.saveTaskVms(this.getProject(), [task]).pipe(
      switchMap(() =>
        this.activity.changeTaskTitle(
          project.owner,
          project.id,
          task.id,
          from,
          title
        )
      )
    );
  }

  changeTaskDescription(
    taskId: string,
    description: string
  ): Observable<unknown> {
    const project = this.getProject();
    const tasks = this.getTasks();
    const task = tasks.find((x) => x.id === taskId)!;
    const from = task.description ?? '';

    task.description = description;

    return this.saveTaskVms(this.getProject(), [task]).pipe(
      switchMap(() =>
        this.activity.changeTaskDescription(
          project.owner,
          project.id,
          task.id,
          from,
          description
        )
      )
    );
  }

  changeTaskAbs(taskId: string, abs: 'set' | undefined): Observable<unknown> {
    const project = this.getProject();
    const tasks = this.getTasks();
    const task = tasks.find((x) => x.id === taskId)!;
    let from = task.absFlag;

    if (from === 'implied') from = undefined;

    task.absFlag = abs;

    return this.saveTaskVms(this.getProject(), [task]).pipe(
      switchMap(() =>
        this.activity.changeTaskAbs(
          project.owner,
          project.id,
          task.id,
          from,
          abs
        )
      )
    );
  }

  importTasks(tasks: ProjectNode[]): Observable<unknown> {
    const project = this.getProject();

    return this.saveTasks(project, tasks).pipe(
      switchMap(() =>
        this.activity.importTasks(project.owner, project.id, tasks)
      )
    );
  }

  private saveReordered(
    originalLevel: string,
    mainTask: ProjectTaskViewModel,
    others: ProjectTaskViewModel[]
  ): Observable<unknown> {
    const project = this.getProject();

    return this.saveTaskVms(project, [mainTask, ...others]).pipe(
      map(() => this.getTasks().find((x) => x.id === mainTask.id)!),
      switchMap((task) =>
        this.activity.reorderTask(
          project.owner,
          project.id,
          task.id,
          task.title,
          originalLevel,
          task.levelText
        )
      )
      //tap(() => this.messaging.notify.success('Projects.TaskReordered'))
    );
  }

  saveTaskVms(
    project: ProjectViewModel,
    upserts: ProjectTaskViewModel[],
    toRemove?: string[]
  ): Observable<void> {
    const models = upserts.map((x) =>
      this.transformers.projectTasks.toModel(project.id, x)
    );

    return this.saveTasks(project, models, toRemove);
  }

  saveTasks(
    project: ProjectViewModel,
    upserts: ProjectNode[],
    toRemove?: string[]
  ): Observable<void> {
    return this.data.projects
      .putTasksAsync(project.owner, project.id, upserts, toRemove ?? [])
      .pipe(tap(() => this.projectStore.tasksChanged(upserts, toRemove)));
  }

  private getProject(): ProjectViewModel {
    return this.projectStore.project()!;
  }

  private getTasks(): ProjectTaskViewModel[] {
    return this.projectStore.viewModels()!;
  }
}
