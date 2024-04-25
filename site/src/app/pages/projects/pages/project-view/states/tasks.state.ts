import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { ActivityData, LISTS, Project, ProjectNode } from '@wbs/core/models';
import { IdService, Messages } from '@wbs/core/services';
import { WbsNodeView } from '@wbs/core/view-models';
import { Transformers, WbsNodeService } from '@wbs/main/services';
import { MetadataStore } from '@wbs/store';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { PROJECT_ACTIONS, TASK_ACTIONS } from '../../../models';
import {
  AddDisciplineToTask,
  ChangeTaskBasics,
  ChangeTaskDisciplines,
  CloneTask,
  CreateTask,
  MarkProjectChanged,
  MoveTaskDown,
  MoveTaskLeft,
  MoveTaskRight,
  MoveTaskUp,
  PhasesChanged,
  RebuildNodeViews,
  RemoveDisciplineToTask,
  RemoveDisciplinesFromTasks,
  RemoveTask,
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

interface StateModel {
  currentId?: string;
  current?: WbsNodeView;
  navSection?: string;
  project?: Project;
  nodes?: ProjectNode[];
  phases?: WbsNodeView[];
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
  private readonly timeline = inject(TimelineService);
  private readonly transformers = inject(Transformers);

  @Selector()
  static current(state: StateModel): WbsNodeView | undefined {
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
  static phases(state: StateModel): WbsNodeView[] | undefined {
    return state.phases;
  }

  @Selector()
  static taskCount(state: StateModel): number {
    return state.nodes?.filter((x) => x.parentId == null).length ?? 0;
  }

  @Action(VerifyTasks)
  verifyTasks(
    ctx: Context,
    { project, force }: VerifyTasks
  ): Observable<void> | void {
    const state = ctx.getState();

    if (state.project?.id === project.id && !force) return;

    return this.data.projectNodes.getAllAsync(project.owner, project.id).pipe(
      tap((nodes) => ctx.patchState({ project, nodes })),
      switchMap(() => ctx.dispatch([new RebuildNodeViews()]))
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
  rebuildNodeViews(ctx: Context): Observable<void> | void {
    let state = ctx.getState();

    if (!state.project || !state.nodes) return;

    const disciplines = this.transformers.nodes.discipline.view.run(
      state.project,
      state.nodes
    );
    const phases = this.transformers.nodes.phase.view.run(
      state.nodes,
      'project',
      state.project.disciplines
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
    const project = state.project!;
    const nodes = structuredClone(state.nodes)!;
    const nodeIndex = nodes.findIndex((x) => x.id === nodeId);

    if (nodeIndex === -1) return of();

    nodes.splice(nodeIndex, 1);

    const parentId = nodes[nodeIndex].parentId;
    const childrenIds = WbsNodeService.getChildrenIds(nodes, nodeId);
    const changedIds = this.transformers.nodes.phase.reorderer.run(
      parentId,
      nodes
    );
    const upserts = nodes.filter((x) => childrenIds.includes(x.id));

    return this.data.projectNodes
      .putAsync(project.owner, project.id, upserts, [nodeId, ...childrenIds])
      .pipe(
        map(() => ctx.patchState({ nodes })),
        tap(() => this.messaging.notify.success('Projects.TaskRemoved')),
        switchMap(() => ctx.dispatch(new RebuildNodeViews())),
        tap(() =>
          this.saveActivity({
            action: TASK_ACTIONS.REMOVED,
            data: {
              title: nodes[nodeIndex].title,
              reason: reason,
            },
            topLevelId: state.project!.id,
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

  @Action(AddDisciplineToTask)
  addDisciplineToTask(
    ctx: Context,
    { taskId, disciplineId }: AddDisciplineToTask
  ): void | Observable<void> {
    const state = ctx.getState();
    const nodes = structuredClone(state.nodes)!;
    const phases = structuredClone(state.phases)!;
    const model = nodes.find((x) => x.id === taskId)!;
    const viewModel = phases.find((x) => x.id === taskId)!;

    if (!model || !viewModel) return;

    if (model.disciplineIds) {
      if (model.disciplineIds.indexOf(disciplineId) === -1)
        model.disciplineIds.push(disciplineId);
      else return;
    } else model.disciplineIds = [disciplineId];

    viewModel.disciplines = model.disciplineIds;

    return this.saveTask(ctx, model).pipe(
      tap(() => ctx.patchState({ nodes, phases }))
    );
  }

  @Action(RemoveDisciplineToTask)
  RemoveDisciplineToTask(
    ctx: Context,
    { taskId, disciplineId }: RemoveDisciplineToTask
  ): void | Observable<void> {
    const state = ctx.getState();
    const nodes = structuredClone(state.nodes)!;
    const phases = structuredClone(state.phases)!;
    const model = nodes.find((x) => x.id === taskId)!;
    const viewModel = phases.find((x) => x.id === taskId)!;

    if (!model?.disciplineIds || !viewModel) return;

    const index = model.disciplineIds.indexOf(disciplineId);

    if (index === -1) return;

    model.disciplineIds.splice(index, 1);

    viewModel.disciplines = model.disciplineIds;

    return this.saveTask(ctx, model).pipe(
      tap(() => ctx.patchState({ nodes, phases }))
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
      tap(() => {
        this.messaging.notify.success('Projects.TaskCreated');
        this.saveActivity({
          data: {
            title: model.title,
          },
          topLevelId: state.project!.id,
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
    { taskId, title, description }: ChangeTaskBasics
  ): Observable<void> | void {
    const state = ctx.getState();
    const model = state.nodes!.find((x) => x.id === taskId)!;
    const viewModel = state.phases!.find((x) => x.id === taskId)!;
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
          nodes: state.nodes,
        });
        if (state.current?.id === taskId)
          ctx.patchState({
            current: viewModel,
          });
      }),
      switchMap(() => ctx.dispatch(new RebuildNodeViews())),
      tap(() => this.saveActivity(...activities))
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

    const taskName =
      model.parentId == undefined
        ? this.metadata.categories.getName(LISTS.PHASE, model.id)! ??
          model.title
        : model.title;

    const activityData: ActivityData = {
      action: TASK_ACTIONS.DISCIPLINES_CHANGED,
      objectId: model.id,
      topLevelId: state.project!.id,
      data: {
        taskName,
        from: model.disciplineIds,
        to: disciplines,
      },
    };
    model.disciplineIds = disciplines;
    viewModel.disciplines = disciplines;

    const now = new Date();

    return this.saveTask(ctx, model).pipe(
      map(() => {
        model.lastModified = now;
        viewModel.lastModified = now;

        ctx.patchState({
          current: viewModel,
          nodes: state.nodes,
        });
      }),
      switchMap(() => ctx.dispatch(new RebuildNodeViews())),
      tap(() => this.saveActivity(activityData))
    );
  }

  @Action(PhasesChanged)
  phasesChanged(ctx: Context, { results }: PhasesChanged): Observable<void> {
    const state = ctx.getState();
    const phaseDefinitions = this.metadata.categories.phases;
    const projectId = state.project!.id;
    const tasks = state.nodes!;
    const toRemoveIds: string[] = [];
    const upserts: ProjectNode[] = [];
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
          projectId,
          phaseIdAssociation: cat,
          order: i + 1,
          lastModified: new Date(),
          title: phase.label,
          description: phase.description,
        };
        tasks.push(task);
        upserts.push(task);
      } else {
        task = {
          id: cat.id,
          projectId,
          order: i + 1,
          lastModified: new Date(),
          title: cat.label,
          description: cat.description,
          phaseIdAssociation: cat.sameAs,
        };
        tasks.push(task);
        upserts.push(task);
      }
    }
    return this.bulkSave(ctx, upserts, toRemoveIds).pipe(
      tap(() => {
        this.messaging.notify.success('Actions.ProjectPhasesChangedTitle');
        this.saveActivity({
          data: results,
          topLevelId: projectId,
          action: PROJECT_ACTIONS.PHASES_CHANGED,
        });
      }),
      switchMap(() => ctx.dispatch(new MarkProjectChanged()))
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
    originalLevel: string,
    mainTask: ProjectNode,
    others: ProjectNode[]
  ): Observable<void> {
    const project = ctx.getState().project!;

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
    const project = ctx.getState().project!;

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
        switchMap(() => ctx.dispatch(new RebuildNodeViews()))
      );
  }
}
