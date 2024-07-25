import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { ActivityData, LISTS, ProjectNode } from '@wbs/core/models';
import {
  IdService,
  Messages,
  Transformers,
  WbsNodeService,
} from '@wbs/core/services';
import { ProjectTaskViewModel, ProjectViewModel } from '@wbs/core/view-models';
import { MetadataStore } from '@wbs/core/store';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { TASK_ACTIONS } from '../../../models';
import {
  AddDisciplineToTask,
  ChangeTaskAbsFlag,
  ChangeTaskBasics,
  ChangeTaskDisciplines,
  CloneTask,
  CreateTask,
  MarkProjectChanged,
  MoveTaskDown,
  MoveTaskLeft,
  MoveTaskRight,
  MoveTaskUp,
  RebuildNodeViews,
  RemoveDisciplineToTask,
  RemoveDisciplinesFromTasks,
  RemoveTask,
  SaveTasks,
  SetChecklistData,
  SetTaskNavSection,
  TreeReordered,
  VerifyTask,
  VerifyTasks,
} from '../actions';
import { TASK_PAGES } from '../models';
import {
  ProjectNavigationService,
  ProjectService,
  TimelineService,
} from '../services';
import { ProjectState } from './project.state';

interface StateModel {
  currentId?: string;
  current?: ProjectTaskViewModel;
  navSection?: string;
  nodes?: ProjectNode[];
  phases?: ProjectTaskViewModel[];
  projectId?: string;
}

declare type Context = StateContext<StateModel>;

@Injectable()
@State<StateModel>({
  name: 'tasks',
  defaults: {},
})
export class TasksState {
  private readonly metadata = inject(MetadataStore);
  private readonly data = inject(DataServiceFactory);
  private readonly messaging = inject(Messages);
  private readonly nav = inject(ProjectNavigationService);
  private readonly service = inject(ProjectService);
  private readonly store = inject(Store);
  private readonly timeline = inject(TimelineService);
  private readonly transformers = inject(Transformers);

  @Selector()
  static current(state: StateModel): ProjectTaskViewModel | undefined {
    return state.current;
  }

  @Selector()
  static navSection(state: StateModel): string | undefined {
    return state.navSection;
  }

  @Selector()
  static nodes(state: StateModel): ProjectNode[] | undefined {
    return state.nodes;
  }

  @Selector()
  static phases(state: StateModel): ProjectTaskViewModel[] | undefined {
    return state.phases;
  }

  private get project(): ProjectViewModel {
    return this.store.selectSnapshot(ProjectState.current)!;
  }

  @Selector()
  static taskCount(state: StateModel): number {
    return state.nodes?.filter((x) => x.parentId == null).length ?? 0;
  }

  @Action(VerifyTasks)
  verifyTasks(ctx: Context, { force }: VerifyTasks): Observable<void> | void {
    const state = ctx.getState();
    const project = this.project;

    if (project.id === state.projectId && !force) return;

    return this.data.projectNodes.getAllAsync(project.owner, project.id).pipe(
      tap((nodes) => ctx.patchState({ nodes })),
      switchMap(() => this.rebuildNodeViews(ctx))
    );
  }

  @Action(VerifyTask)
  verifyProject(ctx: Context, { taskId }: VerifyTask): void {
    const state = ctx.getState();

    if (
      state.current &&
      state.currentId === taskId &&
      state.current.id === taskId
    )
      return;

    ctx.patchState({
      currentId: taskId,
      current: state.phases?.find((x) => x.id === taskId),
    });
  }

  @Action(SetTaskNavSection)
  setNavSection(ctx: Context, { navSection }: SetTaskNavSection): void {
    ctx.patchState({ navSection });
  }

  @Action(RebuildNodeViews)
  rebuildNodeViews(ctx: Context): Observable<void> {
    let state = ctx.getState();
    const project = this.project;

    if (!project || !state.nodes) return of();

    const disciplines = this.transformers.nodes.discipline.view.run(
      project.disciplines,
      state.nodes
    );
    const phases = this.transformers.nodes.phase.view.forProject(
      state.nodes,
      project.disciplines
    );
    ctx.patchState({ phases });

    state = ctx.getState();

    const actions: any[] = [
      new SetChecklistData(undefined, disciplines, phases),
    ];

    if (state.currentId !== state.current?.id)
      actions.push(new VerifyTask(state.currentId!));

    return ctx.dispatch(actions);
  }

  @Action(RemoveTask)
  removeNodeToProject(
    ctx: Context,
    { nodeId, reason, completedAction }: RemoveTask
  ): Observable<any> | void {
    const state = ctx.getState();
    const project = this.project;
    const nodes = structuredClone(state.nodes)!;
    const nodeIndex = nodes.findIndex((x) => x.id === nodeId);
    const node = nodes[nodeIndex];

    if (nodeIndex === -1) return of();

    nodes.splice(nodeIndex, 1);

    const childrenIds = WbsNodeService.getChildrenIds(nodes, nodeId);
    const changedIds = this.transformers.nodes.phase.reorderer.run(
      node.parentId,
      nodes
    );

    const upserts = nodes.filter((x) => changedIds.includes(x.id));

    return this.data.projectNodes
      .putAsync(project.owner, project.id, upserts, [nodeId, ...childrenIds])
      .pipe(
        map(() => ctx.patchState({ nodes })),
        tap(() => this.messaging.notify.success('Projects.TaskRemoved')),
        switchMap(() => this.rebuildNodeViews(ctx)),
        tap(() =>
          this.saveActivity({
            action: TASK_ACTIONS.REMOVED,
            data: {
              title: node.title,
              reason: reason,
            },
            topLevelId: project.id,
            objectId: nodeId,
          })
        ),
        switchMap(() =>
          completedAction ? ctx.dispatch(completedAction) : of()
        )
      );
  }

  @Action(RemoveDisciplinesFromTasks)
  removeDisciplinesFromTasks(
    ctx: Context,
    { removedIds }: RemoveDisciplinesFromTasks
  ): Observable<any> | void {
    const state = ctx.getState();
    const project = this.project;
    const nodes = structuredClone(state.nodes)!;
    const toSave: ProjectNode[] = [];

    for (const node of nodes) {
      if (!node.disciplineIds) continue;

      let newList = node.disciplineIds.filter((x) => !removedIds.includes(x));

      if (node.disciplineIds.length === newList.length) continue;

      node.disciplineIds = newList;
      toSave.push(node);
    }

    return this.data.projectNodes
      .putAsync(project.owner, project.id, toSave, [])
      .pipe(
        tap(() => ctx.patchState({ nodes })),
        switchMap(() => this.rebuildNodeViews(ctx))
      );
  }

  @Action(AddDisciplineToTask)
  addDisciplineToTask(
    ctx: Context,
    { taskId, disciplineId }: AddDisciplineToTask
  ): void | Observable<void> {
    const state = ctx.getState();
    const project = this.project;
    const nodes = structuredClone(state.nodes)!;
    const model = nodes.find((x) => x.id === taskId)!;
    const from = [...(model.disciplineIds ?? [])];

    if (!model) return;

    if (model.disciplineIds) {
      if (model.disciplineIds.indexOf(disciplineId) === -1)
        model.disciplineIds.push(disciplineId);
      else return;
    } else model.disciplineIds = [disciplineId];

    model.lastModified = new Date();

    const activityData: ActivityData = {
      action: TASK_ACTIONS.DISCIPLINES_CHANGED,
      objectId: model.id,
      topLevelId: project.id,
      data: {
        title: model.title,
        from,
        to: model.disciplineIds,
      },
    };

    return this.saveTask(ctx, model).pipe(
      tap(() => ctx.patchState({ nodes })),
      tap(() => this.saveActivity(activityData)),
      switchMap(() => this.rebuildNodeViews(ctx))
    );
  }

  @Action(RemoveDisciplineToTask)
  removeDisciplineToTask(
    ctx: Context,
    { taskId, disciplineId }: RemoveDisciplineToTask
  ): void | Observable<void> {
    const state = ctx.getState();
    const project = this.project;
    const nodes = structuredClone(state.nodes)!;
    const model = nodes.find((x) => x.id === taskId)!;
    const from = [...(model.disciplineIds ?? [])];

    if (!model?.disciplineIds) return;

    const index = model.disciplineIds.indexOf(disciplineId);

    if (index === -1) return;

    model.disciplineIds.splice(index, 1);
    model.lastModified = new Date();

    const activityData: ActivityData = {
      action: TASK_ACTIONS.DISCIPLINES_CHANGED,
      objectId: model.id,
      topLevelId: project.id,
      data: {
        title: model.title,
        from,
        to: model.disciplineIds,
      },
    };

    return this.saveTask(ctx, model).pipe(
      tap(() => ctx.patchState({ nodes })),
      tap(() => this.saveActivity(activityData)),
      switchMap(() => this.rebuildNodeViews(ctx))
    );
  }

  @Action(CloneTask)
  cloneTask(ctx: Context, action: CloneTask): void | Observable<void> {
    const state = ctx.getState();
    const project = this.project;
    const nodes = state.nodes ?? [];
    const node = nodes.find((x) => x.id === action.nodeId);
    const nodeVm = state.phases!.find((x) => x.id === action.nodeId);
    const now = new Date();

    if (node == null) return;

    const order =
      Math.max(
        ...nodes
          .filter((x) => x.parentId === node?.parentId)
          .map((x) => x.order)
      ) + 1;

    const newNode: ProjectNode = {
      id: IdService.generate(),
      order,
      projectId: node.projectId,
      parentId: node.parentId,
      description: node.description,
      disciplineIds: node.disciplineIds,
      tags: node.tags,
      title: node.title + ' Clone',
      createdOn: now,
      lastModified: now,
      absFlag: null,
    };

    return this.saveTask(ctx, newNode).pipe(
      map(() => {
        nodes.push(newNode);

        ctx.patchState({
          nodes,
        });
      }),
      tap(() =>
        this.saveActivity({
          data: {
            title: node.title,
            level: nodeVm!.levelText,
          },
          topLevelId: project.id,
          objectId: newNode.id,
          action: TASK_ACTIONS.CLONED,
        })
      ),
      switchMap(() => this.rebuildNodeViews(ctx))
    );
  }

  @Action(MoveTaskDown)
  moveTaskDown(ctx: Context, action: MoveTaskDown): void | Observable<void> {
    const state = ctx.getState();
    const tasks = structuredClone(state.nodes)!;
    const task = tasks.find((x) => x.id === action.taskId)!;
    const taskVm = state.phases!.find((x) => x.id === action.taskId);
    const task2 = tasks.find(
      (x) => x.parentId === task?.parentId && x.order === task.order + 1
    );
    if (!task || !task2) return;

    task.order++;
    task2.order--;

    return this.saveReordered(ctx, taskVm!.levelText, task, [task2]);
  }

  @Action(MoveTaskLeft)
  moveTaskLeft(ctx: Context, action: MoveTaskLeft): void | Observable<void> {
    const state = ctx.getState();
    const tasks = structuredClone(state.nodes)!;
    const task = tasks.find((x) => x.id === action.taskId);
    const taskVm = state.phases!.find((x) => x.id === action.taskId);
    const parent = tasks.find((x) => x.id === task?.parentId);

    if (!task || !parent) return;

    const toSave: ProjectNode[] = [];
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
    //
    //  Renumber the new siblings
    //
    for (const sibling of tasks.filter((x) => x.parentId === parent.parentId)) {
      if (sibling.order <= parent.order || sibling.id === task.id) continue;

      sibling.order++;
      toSave.push(sibling);
    }
    return this.saveReordered(ctx, taskVm!.levelText, task, toSave);
  }

  @Action(MoveTaskRight)
  moveTaskRight(ctx: Context, action: MoveTaskRight): void | Observable<void> {
    const state = ctx.getState();
    const tasks = structuredClone(state.nodes)!;
    const task = tasks.find((x) => x.id === action.taskId);
    const taskVm = state.phases!.find((x) => x.id === action.taskId);
    let newParent: ProjectNode | undefined;

    if (!task) return;

    const oldSiblings = tasks.filter((x) => x.parentId === task.parentId);
    const toSave: ProjectNode[] = [];
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

    return this.saveReordered(ctx, taskVm!.levelText, task, toSave);
  }

  @Action(MoveTaskUp)
  moveTaskUp(ctx: Context, action: MoveTaskUp): void | Observable<void> {
    const state = ctx.getState();
    const tasks = structuredClone(state.nodes)!;
    const task = tasks.find((x) => x.id === action.taskId)!;
    const taskVm = state.phases!.find((x) => x.id === action.taskId);
    const task2 = tasks.find(
      (x) => x.parentId === task?.parentId && x.order === task.order - 1
    );
    if (!task || !task2) return;

    task.order--;
    task2.order++;

    return this.saveReordered(ctx, taskVm!.levelText, task, [task2]);
  }

  @Action(TreeReordered)
  treeReordered(
    ctx: Context,
    { draggedId, results }: TreeReordered
  ): Observable<void> {
    const state = ctx.getState();
    const upserts: ProjectNode[] = [];
    const taskVm = state.phases!.find((x) => x.id === draggedId);

    for (const id of results.changedIds) {
      const vm = results.rows.find((x) => x.id === id)!;
      const model = state.nodes!.find((x) => x.id === id)!;

      model.order = vm.order;
      model.parentId = vm.parentId;

      upserts.push(model);
    }

    if (upserts.length === 0) return of();

    return this.saveReordered(
      ctx,
      taskVm!.levelText,
      upserts.find((x) => x.id === draggedId)!,
      upserts.filter((x) => x.id !== draggedId)
    );
  }

  @Action(CreateTask)
  createTask(ctx: Context, action: CreateTask): Observable<any> {
    const state = ctx.getState();
    const nodes = state.nodes!;
    const model = this.service.createTask(
      this.project.id,
      action.parentId,
      action.model,
      nodes
    );

    return this.saveTask(ctx, model).pipe(
      map(() => {
        nodes.push(model);

        ctx.patchState({
          nodes,
        });
      }),
      switchMap(() => this.rebuildNodeViews(ctx)),
      tap(() => {
        this.messaging.notify.success('Projects.TaskCreated');
        this.saveActivity({
          data: {
            title: model.title,
          },
          topLevelId: this.project.id,
          objectId: model.id,
          action: TASK_ACTIONS.CREATED,
        });

        if (action.navigateTo) this.nav.toTaskPage(model.id, TASK_PAGES.ABOUT);
      })
    );
  }

  @Action(ChangeTaskBasics)
  changeTaskBasics(
    ctx: Context,
    { taskId, title, description, abs }: ChangeTaskBasics
  ): Observable<void> | void {
    const state = ctx.getState();
    const model = state.nodes!.find((x) => x.id === taskId)!;
    const viewModel = state.phases!.find((x) => x.id === taskId)!;
    const activities: ActivityData[] = [];

    if (model.title !== title) {
      activities.push({
        action: TASK_ACTIONS.TITLE_CHANGED,
        topLevelId: this.project.id,
        objectId: model.id,
        data: {
          from: viewModel.title,
          to: title,
        },
      });
      model.title = title;
    }

    if (model.description !== description) {
      activities.push({
        action: TASK_ACTIONS.DESCRIPTION_CHANGED,
        objectId: model.id,
        topLevelId: this.project.id,
        data: {
          title: model.title,
          from: model.description,
          to: description,
        },
      });
      model.description = description;
    }

    if ((model.absFlag ?? false) !== abs) {
      activities.push({
        action: TASK_ACTIONS.ABS_CHANGED,
        objectId: model.id,
        topLevelId: this.project.id,
        data: {
          title: model.title,
          from: model.absFlag ?? false,
          to: abs,
        },
      });
      model.absFlag = abs;
    }
    //
    //  If no activities then nothing actually changed
    //
    if (activities.length === 0) return;

    return this.saveTask(ctx, model).pipe(
      map(() => {
        ctx.patchState({
          nodes: state.nodes,
        });
        if (state.current?.id === taskId)
          ctx.patchState({
            current: viewModel,
          });
      }),
      switchMap(() => this.rebuildNodeViews(ctx)),
      tap(() => this.saveActivity(...activities))
    );
  }

  @Action(ChangeTaskAbsFlag)
  changeTaskAbsFlag(
    ctx: Context,
    { taskId, abs }: ChangeTaskAbsFlag
  ): Observable<void> {
    const state = ctx.getState();
    const model = state.nodes!.find((x) => x.id === taskId)!;

    return ctx.dispatch(
      new ChangeTaskBasics(taskId, model.title, model.description ?? '', abs)
    );
  }

  @Action(ChangeTaskDisciplines)
  changeTaskDisciplines(
    ctx: Context,
    { taskId, disciplines }: ChangeTaskDisciplines
  ): Observable<void> | void {
    const state = ctx.getState();
    const model = state.nodes!.find((x) => x.id === taskId)!;

    if (
      JSON.stringify(model.disciplineIds ?? []) === JSON.stringify(disciplines)
    )
      return;

    const taskName =
      model.parentId == undefined
        ? this.metadata.categories.getName(LISTS.PHASE, model.id)! ??
          model.title
        : model.title;

    const activityData: ActivityData = {
      action: TASK_ACTIONS.DISCIPLINES_CHANGED,
      objectId: model.id,
      topLevelId: this.project.id,
      data: {
        taskName,
        from: model.disciplineIds,
        to: disciplines,
      },
    };
    model.disciplineIds = disciplines;

    const now = new Date();

    return this.saveTask(ctx, model).pipe(
      map(() => {
        model.lastModified = now;

        ctx.patchState({ nodes: state.nodes });
      }),
      switchMap(() => this.rebuildNodeViews(ctx)),
      tap(() => this.saveActivity(activityData))
    );
  }

  @Action(SaveTasks)
  saveTasks(
    ctx: Context,
    { tasks, activityInfo }: SaveTasks
  ): void | Observable<void> {
    return this.bulkSave(ctx, tasks, []).pipe(
      tap(() => {
        const list = ctx.getState().nodes!;

        for (const task of tasks) {
          const index = list.findIndex((x) => x.id === task.id);

          if (index > -1) list[index] = task;
          else list.push(task);
        }
        ctx.patchState({ nodes: structuredClone(list) });

        if (activityInfo) this.saveActivity(activityInfo);
      }),
      switchMap(() => ctx.dispatch(new MarkProjectChanged())),
      switchMap(() => this.rebuildNodeViews(ctx))
    );
  }

  private saveActivity(...data: ActivityData[]): void {
    this.timeline.saveProjectActions(
      data.map((x) => this.timeline.createProjectRecord(x))
    );
  }

  private saveTask(ctx: Context, task: ProjectNode): Observable<void> {
    const project = this.project;

    task.lastModified = new Date();

    return this.data.projectNodes
      .putAsync(project.owner, project.id, [task], [])
      .pipe(switchMap(() => ctx.dispatch(new MarkProjectChanged())));
  }

  private saveReordered(
    ctx: Context,
    originalLevel: string,
    mainTask: ProjectNode,
    others: ProjectNode[]
  ): Observable<void> {
    const project = this.project;

    return this.bulkSave(ctx, [mainTask, ...others], []).pipe(
      tap(() => {
        const newVm = ctx.getState().phases!.find((x) => x.id === mainTask.id);

        this.saveActivity({
          data: {
            title: mainTask.title,
            from: originalLevel,
            to: newVm?.levelText,
          },
          topLevelId: project.id,
          objectId: mainTask.id,
          action: TASK_ACTIONS.REORDERED,
        });
      }),
      tap(() => this.messaging.notify.success('Projects.TaskReordered')),
      switchMap(() => ctx.dispatch(new MarkProjectChanged()))
    );
  }

  private bulkSave(
    ctx: Context,
    upserts: ProjectNode[],
    toRemoveIds: string[]
  ): Observable<void> {
    const project = this.project;

    return this.data.projectNodes
      .putAsync(project.owner, project.id, upserts, toRemoveIds)
      .pipe(
        tap(() => {
          const tasks = ctx.getState().nodes!;

          for (const id of toRemoveIds) {
            const index = tasks.findIndex((x) => x.id === id);

            if (index > -1) tasks.splice(index, 1);
          }
          for (const task of upserts) {
            const index = tasks.findIndex((x) => x.id === task.id);

            if (index > -1) tasks[index] = task;
            else tasks.push(task);
          }
          ctx.patchState({
            nodes: structuredClone(tasks),
          });
        }),
        switchMap(() => this.rebuildNodeViews(ctx))
      );
  }
}
