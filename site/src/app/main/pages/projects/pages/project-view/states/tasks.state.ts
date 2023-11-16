import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  ActivityData,
  Project,
  PROJECT_NODE_VIEW,
  PROJECT_NODE_VIEW_TYPE,
  ProjectNode,
} from '@wbs/core/models';
import { IdService, Messages, ProjectService } from '@wbs/core/services';
import { WbsNodeView } from '@wbs/core/view-models';
import { Transformers } from '@wbs/main/services';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { TASK_ACTIONS } from '../../../models';
import {
  ChangeTaskBasics,
  ChangeTaskDisciplines,
  CloneTask,
  CreateTask,
  MarkProjectChanged,
  MoveTaskDown,
  MoveTaskLeft,
  MoveTaskRight,
  MoveTaskUp,
  NavigateToTask,
  RebuildNodeViews,
  RemoveDisciplinesFromTasks,
  RemoveTask,
  SetChecklistData,
  TreeReordered,
  VerifyTask,
  VerifyTasks,
} from '../actions';
import { ProjectNavigationService, TimelineService } from '../services';
import { TaskDetailsViewModel } from '../view-models';

interface StateModel {
  currentId?: string;
  currentView?: PROJECT_NODE_VIEW_TYPE;
  current?: TaskDetailsViewModel;
  project?: Project;
  nodes?: ProjectNode[];
  phases?: WbsNodeView[];
  disciplines?: WbsNodeView[];
}

declare type Context = StateContext<StateModel>;

@Injectable()
@State<StateModel>({
  name: 'tasks',
  defaults: {},
})
export class TasksState {
  constructor(
    private readonly data: DataServiceFactory,
    private readonly messaging: Messages,
    private readonly nav: ProjectNavigationService,
    private readonly service: ProjectService,
    private readonly timeline: TimelineService,
    private readonly transformers: Transformers
  ) {}

  @Selector()
  static current(state: StateModel): TaskDetailsViewModel | undefined {
    return state.current;
  }

  @Selector()
  static disciplines(state: StateModel): WbsNodeView[] | undefined {
    return state.disciplines;
  }

  @Selector()
  static nodes(state: StateModel): ProjectNode[] | undefined {
    return state.nodes;
  }

  @Selector()
  static phases(state: StateModel): WbsNodeView[] | undefined {
    return state.phases;
  }

  @Selector()
  static taskCount(state: StateModel): number {
    if (!state.nodes || !state.project) return 0;

    const phaseIds = state.project.phases.map((x) =>
      typeof x === 'string' ? x : x.id
    );

    return state.nodes.filter((x) => phaseIds.indexOf(x.id) === -1).length;
  }

  @Action(VerifyTasks)
  verifyTasks(
    ctx: Context,
    { project, force }: VerifyTasks
  ): Observable<void> | void {
    const state = ctx.getState();

    if (state.project?.id === project.id && !force) return;

    return this.data.projectNodes.getAllAsync(project.owner, project.id).pipe(
      tap((nodes) =>
        ctx.patchState({
          project,
          nodes: nodes?.filter((x) => !x.removed) ?? [],
        })
      ),
      switchMap(() => ctx.dispatch([new RebuildNodeViews()]))
    );
  }

  @Action(VerifyTask)
  verifyProject(ctx: Context, { taskId, viewNode }: VerifyTask): void {
    const state = ctx.getState();

    if (
      state.current &&
      state.currentId === taskId &&
      state.current.id === taskId &&
      state.current.view === viewNode
    )
      return;

    ctx.patchState({ currentId: taskId, currentView: viewNode });

    this.createDetailsVm(ctx, taskId, viewNode);
  }

  @Action(NavigateToTask)
  navigateToTask({}: Context, action: NavigateToTask): void {
    this.nav.toTask(action.nodeId);
  }

  @Action(RebuildNodeViews)
  rebuildNodeViews(ctx: Context): Observable<void> | void {
    let state = ctx.getState();

    if (!state.project || !state.nodes) return;

    const disciplines = this.transformers.nodes.discipline.view.run(
      state.project,
      state.nodes
    );
    const phases = this.transformers.nodes.phase.view.run(
      state.project,
      state.nodes
    );
    ctx.patchState({ disciplines, phases });

    state = ctx.getState();

    const actions: any[] = [
      new SetChecklistData(undefined, disciplines, phases),
    ];

    if (state.currentId !== state.current?.id)
      actions.push(new VerifyTask(state.current?.view!, state.currentId!));

    return ctx.dispatch(actions);
  }

  @Action(RemoveTask)
  removeNodeToProject(
    ctx: Context,
    action: RemoveTask
  ): Observable<any> | void {
    const state = ctx.getState();
    const project = state.project!;
    const nodes = structuredClone(state.nodes)!;
    const nodeIndex = nodes.findIndex((x) => x.id === action.nodeId);

    if (nodeIndex === -1) return of();

    nodes[nodeIndex].removed = true;

    let changedIds: string[] = [
      action.nodeId,
      ...this.transformers.nodes.phase.reorderer.run(state.project!, nodes),
    ];

    const removedIds: string[] = [];

    for (const node of nodes) {
      if (changedIds.indexOf(node.id) === -1) continue;

      removedIds.push(node.id);
    }
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
          action.completedAction ? ctx.dispatch(action.completedAction) : of()
        )
      );
  }

  @Action(RemoveDisciplinesFromTasks)
  removeDisciplinesFromTasks(
    ctx: Context,
    { removedIds }: RemoveDisciplinesFromTasks
  ): Observable<any> | void {
    const state = ctx.getState();
    const nodes = structuredClone(state.nodes)!;
    const toSave: ProjectNode[] = [];

    for (const node of nodes) {
      if (!node.disciplineIds) continue;

      let save = false;

      for (let i = 0; i < node.disciplineIds.length; i++) {
        const id = node.disciplineIds[i];

        if (removedIds.indexOf(id) === -1) continue;

        node.disciplineIds.splice(i, 1);
        i--;
        save = true;
      }
      if (save) toSave.push(node);
    }

    return this.data.projectNodes
      .putAsync(state.project!.owner, state.project!.id, toSave, [])
      .pipe(
        tap(() => ctx.patchState({ nodes })),
        tap(() => ctx.dispatch(new RebuildNodeViews()))
      );
  }

  @Action(CloneTask)
  cloneTask(ctx: Context, action: CloneTask): void | Observable<void> {
    const state = ctx.getState();
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
      removed: false,
      tags: node.tags,
      title: node.title + ' Clone',
      createdOn: now,
      lastModified: now,
    };

    return this.saveTask(ctx, newNode).pipe(
      map(() => {
        nodes.push(newNode);

        ctx.patchState({
          nodes,
        });
      }),
      switchMap(() => ctx.dispatch(new RebuildNodeViews())),
      tap(() =>
        this.saveActivity({
          data: {
            title: node.title,
            level: nodeVm!.levelText,
          },
          topLevelId: state.project!.id,
          objectId: newNode.id,
          action: TASK_ACTIONS.CLONED,
        })
      ),
      tap(() => this.messaging.notify.success('Projects.TaskCloned'))
    );
  }

  @Action(MoveTaskDown)
  moveTaskDown(ctx: Context, action: MoveTaskDown): void | Observable<void> {
    const state = ctx.getState();
    const tasks = structuredClone(state.nodes)!;
    const task = tasks.find((x) => x.id === action.taskId);
    const taskVm = state.phases!.find((x) => x.id === action.taskId);
    const task2 = tasks.find(
      (x) => x.parentId === task?.parentId && x.order === task.order + 1
    );
    if (!task || !task2) return;

    task.order++;
    task2.order--;

    return this.saveReordered(ctx, state.project!, taskVm!.levelText, task, [
      task2,
    ]);
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
    return this.saveReordered(
      ctx,
      state.project!,
      taskVm!.levelText,
      task,
      toSave
    );
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

    return this.saveReordered(
      ctx,
      state.project!,
      taskVm!.levelText,
      task,
      toSave
    );
  }

  @Action(MoveTaskUp)
  moveTaskUp(ctx: Context, action: MoveTaskUp): void | Observable<void> {
    const state = ctx.getState();
    const tasks = structuredClone(state.nodes)!;
    const task = tasks.find((x) => x.id === action.taskId);
    const taskVm = state.phases!.find((x) => x.id === action.taskId);
    const task2 = tasks.find(
      (x) => x.parentId === task?.parentId && x.order === task.order - 1
    );
    if (!task || !task2) return;

    task.order--;
    task2.order++;

    return this.saveReordered(ctx, state.project!, taskVm!.levelText, task, [
      task2,
    ]);
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

    console.log(upserts);

    return this.saveReordered(
      ctx,
      state.project!,
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
      state.project!.id,
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
      switchMap(() => ctx.dispatch(new RebuildNodeViews())),
      tap(() =>
        this.saveActivity({
          data: {
            title: model.title,
          },
          topLevelId: state.project!.id,
          objectId: model.id,
          action: TASK_ACTIONS.CREATED,
        })
      ),
      tap(() => this.messaging.notify.success('Projects.TaskCreated')),
      switchMap(() =>
        action.navigateTo ? ctx.dispatch(new NavigateToTask(model.id)) : of()
      )
    );
  }

  @Action(ChangeTaskBasics)
  changeTaskBasics(
    ctx: Context,
    { title, description }: ChangeTaskBasics
  ): Observable<void> | void {
    const state = ctx.getState();
    const viewModel = state.current!;
    const model = state.nodes!.find((x) => x.id === viewModel.id)!;
    const activities: ActivityData[] = [];

    if (model.title !== title) {
      activities.push({
        action: TASK_ACTIONS.TITLE_CHANGED,
        topLevelId: state.project!.id,
        objectId: model.id,
        data: {
          from: viewModel.title,
          to: title,
        },
      });
      model.title = title;
      viewModel.title = title;
    }

    if (model.description !== description) {
      activities.push({
        action: TASK_ACTIONS.DESCRIPTION_CHANGED,
        objectId: model.id,
        topLevelId: state.project!.id,
        data: {
          title: model.title,
          from: model.description,
          to: description,
        },
      });
      model.description = description;
      viewModel.description = description;
    }
    //
    //  If no activities then nothing actually changed
    //
    if (activities.length === 0) return;

    return this.saveTask(ctx, model).pipe(
      map(() => {
        ctx.patchState({
          current: viewModel,
          nodes: state.nodes,
        });
      }),
      switchMap(() => ctx.dispatch(new RebuildNodeViews())),
      tap(() => this.saveActivity(...activities)),
      tap(() => this.messaging.notify.success('Projects.TaskUpdated'))
    );
  }

  @Action(ChangeTaskDisciplines)
  changeTaskDisciplines(
    ctx: Context,
    { disciplines }: ChangeTaskDisciplines
  ): Observable<void> | void {
    const state = ctx.getState();
    const viewModel = state.current!;
    const model = state.nodes!.find((x) => x.id === viewModel.id)!;

    if (
      JSON.stringify(model.disciplineIds ?? []) === JSON.stringify(disciplines)
    )
      return;

    const activityData: ActivityData = {
      action: TASK_ACTIONS.DISCIPLINES_CHANGED,
      objectId: model.id,
      topLevelId: state.project!.id,
      data: {
        title: model.title,
        from: model.disciplineIds,
        to: disciplines,
      },
    };
    model.disciplineIds = disciplines;
    viewModel.disciplines = disciplines;

    return this.saveTask(ctx, model).pipe(
      tap(() => this.messaging.notify.success('Projects.TaskUpdated')),
      map(() => {
        ctx.patchState({
          current: viewModel,
          nodes: state.nodes,
        });
      }),
      switchMap(() => ctx.dispatch(new RebuildNodeViews())),
      tap(() => this.saveActivity(activityData))
    );
  }

  private saveActivity(...data: ActivityData[]): void {
    this.timeline.saveProjectActions(
      data.map((x) => this.timeline.createProjectRecord(x))
    );
  }

  private saveTask(ctx: Context, task: ProjectNode): Observable<void> {
    const project = ctx.getState().project!;

    task.lastModified = new Date();

    return this.data.projectNodes
      .putAsync(project.owner, project.id, [task], [])
      .pipe(switchMap(() => ctx.dispatch(new MarkProjectChanged())));
  }

  private saveReordered(
    ctx: Context,
    project: Project,
    originalLevel: string,
    mainTask: ProjectNode,
    others: ProjectNode[]
  ): Observable<void> {
    return this.data.projectNodes
      .putAsync(project.owner, project.id, [mainTask, ...others], [])
      .pipe(
        tap(() => {
          const tasks = ctx.getState().nodes!;

          for (const task of [mainTask, ...others]) {
            const index = tasks.findIndex((x) => x.id === task.id);

            if (index > -1) tasks[index] = task;
            else tasks.push(task);
          }
          ctx.patchState({
            nodes: structuredClone(tasks),
          });
        }),
        switchMap(() => ctx.dispatch(new RebuildNodeViews())),
        tap(() => {
          const newVm = ctx
            .getState()
            .phases!.find((x) => x.id === mainTask.id);

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

  private createDetailsVm(
    ctx: Context,
    id: string,
    view: PROJECT_NODE_VIEW_TYPE
  ): void {
    const state = ctx.getState();
    const tasks = state.nodes ?? [];
    const taskVms =
      (view === PROJECT_NODE_VIEW.DISCIPLINE
        ? state.disciplines
        : state.phases) ?? [];

    if (!state.project || tasks.length === 0 || taskVms.length === 0) {
      ctx.patchState({
        current: undefined,
      });
      return;
    }

    const nodeIndex = taskVms.findIndex((x) => x.id === id);
    const task = taskVms[nodeIndex];
    const parent = taskVms.find((x) => x.id === task.parentId);

    ctx.patchState({
      current: {
        parent,
        view,
        id,
        disciplines: task.disciplines,
        lastModified: task.lastModified,
        levels: task.levels,
        levelText: task.levelText,
        title: task.title,
        description: task.description,
        nextTaskId:
          nodeIndex + 1 === taskVms.length
            ? undefined
            : taskVms[nodeIndex + 1].id,
        previousTaskId: nodeIndex === 0 ? undefined : taskVms[nodeIndex - 1].id,
        subTasks: this.getSubTasks(id, taskVms),
        childrenIds: task.childrenIds,
      },
    });
  }

  private getSubTasks(
    taskId: string,
    phaseViews: WbsNodeView[]
  ): WbsNodeView[] {
    const list: WbsNodeView[] = [];
    const subTaskIds = this.getSubTaskIds(taskId, phaseViews);

    for (const x of phaseViews) {
      if (subTaskIds.indexOf(x.id) === -1) continue;

      const item = structuredClone(x);

      if (item.parentId === taskId) {
        item.parentId = null;
        item.treeParentId = null;
      }
      list.push(item);
    }

    return list;
  }

  private getSubTaskIds(taskId: string, tasks: WbsNodeView[]): string[] {
    const ids: string[] = tasks
      .filter((x) => x.parentId === taskId)
      .map((x) => x.id);

    for (const id of ids) {
      ids.push(...this.getSubTaskIds(id, tasks));
    }

    return ids;
  }
}
