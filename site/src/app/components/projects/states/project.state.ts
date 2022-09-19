import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
  DialogCloseResult,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { WbsNodeDeleteService } from '@wbs/components/_features';
import { ProjectUpdated } from '@wbs/shared/actions';
import {
  Activity,
  ActivityData,
  Project,
  PROJECT_NODE_VIEW,
  ROLES,
  WbsNode,
} from '@wbs/shared/models';
import {
  ContainerService,
  DataServiceFactory,
  IdService,
  Messages,
  WbsTransformers,
} from '@wbs/shared/services';
import { WbsNodeView } from '@wbs/shared/view-models';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { TaskCreateDialogComponent } from '../components/task-create-dialog/task-create-dialog.component';
import { PROJECT_ACTIONS, TASK_ACTIONS, UserRole } from '../models';
import {
  ChangeProjectDisciplines,
  ChangeProjectPhases,
  ChangeProjectTitle,
  ChangeTaskTitle,
  CloneTask,
  CreateTask,
  MoveTaskDown,
  MoveTaskLeft,
  MoveTaskRight,
  MoveTaskUp,
  RebuildNodeViews,
  RemoveTask,
  SaveUpload,
  SetProject,
  TreeReordered,
  VerifyProject,
} from '../project.actions';

interface StateModel {
  activity?: Activity[];
  current?: Project;
  disciplines?: WbsNodeView[];
  nodes?: WbsNode[];
  phases?: WbsNodeView[];
  roles: UserRole[];
}

@Injectable()
@State<StateModel>({
  name: 'project',
  defaults: {
    roles: [
      {
        role: ROLES.PM,
        userId: 'auth0-cw',
      },
      {
        role: ROLES.SME,
        userId: 'auth0-bh',
      },
    ],
  },
})
export class ProjectState {
  constructor(
    private readonly containers: ContainerService,
    private readonly data: DataServiceFactory,
    private readonly deleteService: WbsNodeDeleteService,
    private readonly dialog: DialogService,
    private readonly messages: Messages,
    private readonly transformers: WbsTransformers
  ) {}

  @Selector()
  static activity(state: StateModel): Activity[] | undefined {
    return state.activity;
  }

  @Selector()
  static current(state: StateModel): Project | undefined {
    return state.current;
  }

  @Selector()
  static disciplines(state: StateModel): WbsNodeView[] | undefined {
    return state.disciplines;
  }

  @Selector()
  static nodes(state: StateModel): WbsNode[] | undefined {
    return state.nodes;
  }

  @Selector()
  static phases(state: StateModel): WbsNodeView[] | undefined {
    return state.phases;
  }

  @Selector()
  static roles(state: StateModel): UserRole[] {
    return state.roles;
  }

  @Action(VerifyProject)
  verifyProject(
    ctx: StateContext<StateModel>,
    action: VerifyProject
  ): Observable<void> {
    const state = ctx.getState();

    return state.current?.id !== action.projectId
      ? ctx.dispatch(new SetProject(action.projectId))
      : of();
  }

  @Action(SetProject)
  setProject(
    ctx: StateContext<StateModel>,
    action: SetProject
  ): Observable<void> {
    return forkJoin({
      project: this.data.projects.getAsync(action.projectId),
      nodes: this.data.projectNodes.getAllAsync(action.projectId),
      activity: this.data.activities.getAsync(action.projectId),
    }).pipe(
      tap((data) =>
        ctx.patchState({
          activity: data.activity.sort(this.sortActivity),
          current: data.project,
          nodes: data.nodes.filter((x) => !x.removed),
        })
      ),
      switchMap(() => ctx.dispatch(new RebuildNodeViews()))
    );
  }

  @Action(RebuildNodeViews)
  rebuildNodeViews(ctx: StateContext<StateModel>): void {
    const state = ctx.getState();

    if (!state.current || !state.nodes) return;

    ctx.patchState({
      disciplines: this.transformers.nodes.discipline.view.run(
        state.current,
        state.nodes
      ),
      phases: this.transformers.nodes.phase.view.run(
        state.current,
        state.nodes
      ),
    });
  }

  /*@Action(AddSubTask)
  addNodeToProject(
    ctx: StateContext<StateModel>,
    action: AddSubTask
  ): Observable<any> {
    const state = ctx.getState();
    const node = action.parent;

    node.id = IdService.generate();

    return this.data.projectNodes.putAsync(state.current!.id, node).pipe(
      // TO DO SEND ACTIVITY
      tap(() => {
        const nodes = [...ctx.getState().nodes!];
        nodes.push(node);

        ctx.patchState({
          nodes,
        });
      })
    );
  }*/

  @Action(RemoveTask)
  removeNodeToProject(
    ctx: StateContext<StateModel>,
    action: RemoveTask
  ): Observable<any> | void {
    return this.deleteService.launchAsync().pipe(
      switchMap((reason) => {
        if (!reason) return of();

        const state = ctx.getState();
        const nodes = this.copy(state.nodes)!;
        const nodeIndex = nodes.findIndex((x) => x.id === action.nodeId);

        if (nodeIndex === -1) return of();

        nodes[nodeIndex].removed = true;

        let changedIds: string[] = [action.nodeId];

        changedIds.push(
          ...this.transformers.nodes.phase.reorderer.run(state.current!, nodes)
        );
        /*changedIds.push(
          ...this.transformers.nodes.discipline.reorderer.run(state.current!, nodes)
        );*/
        const changed: Observable<void>[] = [];
        const parentId = state.current!.id;

        for (const node of nodes) {
          if (changedIds.indexOf(node.id) === -1) continue;

          changed.push(this.data.projectNodes.putAsync(parentId, node));
        }
        return forkJoin(changed).pipe(
          map(() =>
            ctx.patchState({
              nodes,
            })
          ),
          switchMap(() => ctx.dispatch(new RebuildNodeViews())),
          switchMap(() =>
            action.completedAction ? ctx.dispatch(action.completedAction) : of()
          )
        );
        /*
          return this.data.projectNodes.putAsync(state.current!.id, node).pipe(
            // TO DO SEND REASON
            // TO DO SEND ACTIVITY
            map(() => {
              nodes[nodeIndex] = node;
              ctx.patchState({
                nodes: [...nodes],
              });
            })
          );
        */
      })
    );
  }

  @Action(ChangeProjectTitle)
  changeProjectTitle(
    ctx: StateContext<StateModel>,
    action: ChangeProjectTitle
  ): Observable<any> {
    const state = ctx.getState();
    const project = state.current!;

    project.title = action.title;

    return this.saveProject(ctx, project).pipe(
      tap(() => this.messages.success('Projects.ProjectTitleUpdated')),
      switchMap(() =>
        this.saveActivity(ctx, {
          action: PROJECT_ACTIONS.TITLE_CHANGED,
          data: [action.title],
          labelTitle: 'Actions.ProjectTitleChanged',
        })
      )
    );
  }

  @Action(ChangeProjectPhases)
  changeProjectPhases(
    ctx: StateContext<StateModel>,
    action: ChangeProjectPhases
  ): Observable<any> {
    const state = ctx.getState();
    const project = state.current!;

    project.categories.phase = action.phases;

    return this.saveProject(ctx, project).pipe(
      switchMap(() =>
        this.saveActivity(ctx, {
          action: PROJECT_ACTIONS.PHASES_CHANGED,
          data: [],
          labelTitle: 'Actions.ProjectPhasesChanged',
        })
      ),
      switchMap(() => ctx.dispatch(new RebuildNodeViews())),
      tap(() => this.messages.success('Projects.ProjectPhasesUpdated'))
    );
  }

  @Action(CloneTask)
  cloneTask(
    ctx: StateContext<StateModel>,
    action: CloneTask
  ): void | Observable<void> {
    const state = ctx.getState();
    const nodes = state.nodes ?? [];
    const node = nodes.find((x) => x.id === action.nodeId);

    if (node == null) return;

    const order =
      Math.max(
        ...nodes
          .filter((x) => x.parentId === node?.parentId)
          .map((x) => x.order)
      ) + 1;

    const newNode: WbsNode = {
      _ts: 0,
      id: IdService.generate(),
      order,
      parentId: node.parentId,
      description: node.description,
      discipline: node.discipline,
      disciplineIds: node.disciplineIds,
      phase: node.phase,
      removed: false,
      tags: node.tags,
      title: node.title + ' Clone',
    };

    return this.saveTask(ctx, newNode).pipe(
      map(() => {
        nodes.push(newNode);

        ctx.patchState({
          nodes,
        });
      }),
      switchMap(() => ctx.dispatch(new RebuildNodeViews())),
      switchMap(() =>
        this.saveActivity(ctx, {
          data: [node.title],
          objectId: newNode.id,
          action: TASK_ACTIONS.CLONED,
          labelTitle: 'Actions.TaskCloned',
        })
      ),
      tap(() => this.messages.success('Projects.TaskCloned'))
    );
  }

  @Action(MoveTaskDown)
  moveTaskDown(
    ctx: StateContext<StateModel>,
    action: MoveTaskDown
  ): void | Observable<void> {
    const state = ctx.getState();
    const tasks = this.copy(state.nodes)!;
    const task = tasks.find((x) => x.id === action.taskId);
    const task2 = tasks.find(
      (x) => x.parentId === task?.parentId && x.order === task.order + 1
    );
    if (!task || !task2) return;

    task.order++;
    task2.order--;

    return this.saveReordered(ctx, state.current!.id, task, [task2]);
  }

  @Action(MoveTaskLeft)
  moveTaskLeft(
    ctx: StateContext<StateModel>,
    action: MoveTaskLeft
  ): void | Observable<void> {
    const state = ctx.getState();
    const tasks = this.copy(state.nodes)!;
    const task = tasks.find((x) => x.id === action.taskId);
    const parent = tasks.find((x) => x.id === task?.parentId);

    if (!task || !parent) return;

    const toSave: WbsNode[] = [];
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
    return this.saveReordered(ctx, state.current!.id, task, toSave);
  }

  @Action(MoveTaskRight)
  moveTaskRight(
    ctx: StateContext<StateModel>,
    action: MoveTaskRight
  ): void | Observable<void> {
    const state = ctx.getState();
    const tasks = this.copy(state.nodes)!;
    const task = tasks.find((x) => x.id === action.taskId);
    let newParent: WbsNode | undefined;

    if (!task) return;

    const oldSiblings = tasks.filter((x) => x.parentId === task.parentId);
    const toSave: WbsNode[] = [];
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

    return this.saveReordered(ctx, state.current!.id, task, toSave);
  }

  @Action(MoveTaskUp)
  moveTaskUp(
    ctx: StateContext<StateModel>,
    action: MoveTaskUp
  ): void | Observable<void> {
    const state = ctx.getState();
    const tasks = this.copy(state.nodes)!;
    const task = tasks.find((x) => x.id === action.taskId);
    const task2 = tasks.find(
      (x) => x.parentId === task?.parentId && x.order === task.order - 1
    );
    if (!task || !task2) return;

    task.order--;
    task2.order++;

    return this.saveReordered(ctx, state.current!.id, task, [task2]);
  }

  @Action(ChangeProjectDisciplines)
  changeProjectDisciplines(
    ctx: StateContext<StateModel>,
    action: ChangeProjectDisciplines
  ): Observable<any> {
    const state = ctx.getState();
    const project = state.current!;

    project.categories.discipline = action.disciplines;

    return this.saveProject(ctx, project).pipe(
      tap(() => this.messages.success('Projects.ProjectDisciplinesUpdated')),
      switchMap(() =>
        this.saveActivity(ctx, {
          action: PROJECT_ACTIONS.DISCIPLINES_CHANGED,
          data: [],
          labelTitle: 'Actions.ProjectDisciplinesChanged',
        })
      ),
      switchMap(() => ctx.dispatch(new RebuildNodeViews()))
    );
  }

  @Action(ChangeTaskTitle)
  changeTaskTitle(
    ctx: StateContext<StateModel>,
    action: ChangeTaskTitle
  ): Observable<void> | void {
    const nodes = ctx.getState().nodes;

    if (!nodes) return;

    const index = nodes.findIndex((x) => x.id === action.taskId);

    if (index === -1) return;

    let node = this.copy(nodes[index]);

    node.title = action.title;

    return this.saveTask(ctx, node).pipe(
      map(() => {
        nodes[index] = node;

        ctx.patchState({
          nodes,
        });
      }),
      switchMap(() => ctx.dispatch(new RebuildNodeViews())),
      switchMap(() =>
        this.saveActivity(ctx, {
          data: [action.title],
          objectId: action.taskId,
          action: TASK_ACTIONS.TITLE_CHANGED,
          labelTitle: 'Actions.TaskTitleChanged',
        })
      ),
      tap(() => this.messages.success('Projects.TaskTitleUpdated'))
    );
  }

  @Action(TreeReordered)
  treeReordered(
    ctx: StateContext<StateModel>,
    action: TreeReordered
  ): Observable<void> {
    const state = ctx.getState();
    const project = state.current!;
    const models = state.nodes!;
    const upserts: WbsNode[] = [];
    const nodeViews =
      (action.view === PROJECT_NODE_VIEW.DISCIPLINE
        ? state.disciplines
        : state.phases) ?? [];

    for (const vm of nodeViews) {
      const vm2 = action.rows.find((x) => x.id === vm.id);

      if (!vm2) continue;
      if (vm.order === vm2.order && vm.parentId === vm2.parentId) continue;

      const orig = models.find((x) => x.id === vm.id)!;
      const model = this.copy(orig);

      model.order = vm2.order;
      model.parentId = vm2.parentId;

      upserts.push(model);
    }

    if (upserts.length === 0) return of();

    return this.saveReordered(
      ctx,
      project.id,
      upserts.find((x) => x.id === action.draggedId)!,
      upserts.filter((x) => x.id !== action.draggedId)
    );
  }

  @Action(SaveUpload)
  saveUpload(
    ctx: StateContext<StateModel>,
    action: SaveUpload
  ): Observable<any> {
    const state = ctx.getState();
    const project = state.current!;
    var saves: Observable<any>[] = [];

    if (action.results.cats !== project.categories.phase) {
      project.categories.phase = action.results.cats;

      saves.push(this.saveProject(ctx, project));
    }
    if (
      action.results.removeIds.length > 0 ||
      action.results.upserts.length > 0
    ) {
      saves.push(
        this.data.projectNodes
          .batchAsync(
            project.id,
            action.results.upserts,
            action.results.removeIds
          )
          .pipe(
            tap(() => {
              const nodes = ctx.getState().nodes!;

              for (const id of action.results.removeIds) {
                const index = nodes.findIndex((x) => x.id === id);

                if (index > -1) nodes.splice(index, 1);
              }
              for (const node of action.results.upserts) {
                const index = nodes.findIndex((x) => x.id === node.id);

                if (index > -1) nodes[index] = node;
                else nodes.push(node);
              }
              ctx.patchState({
                nodes,
              });
            })
          )
      );
    }

    return saves.length === 0
      ? of()
      : forkJoin(saves).pipe(tap(() => ctx.dispatch(new RebuildNodeViews())));
  }

  @Action(CreateTask)
  createTask(
    ctx: StateContext<StateModel>,
    action: CreateTask
  ): Observable<any> {
    const dialogRef = this.dialog.open({
      content: TaskCreateDialogComponent,
      appendTo: this.containers.body,
    });
    const comp = <TaskCreateDialogComponent>dialogRef.content.instance;

    comp.setup(ctx.getState().current!.categories.discipline);

    return dialogRef.result.pipe(
      switchMap((result: DialogCloseResult | Partial<WbsNode>) => {
        if (result instanceof DialogCloseResult) return of();

        const nodes = ctx.getState().nodes!;
        const siblings = nodes.filter((x) => x.parentId === action.parentId);
        let order = 0;

        for (const x of siblings) {
          if (x.order > order) order = x.order;
        }
        order++;

        const model: WbsNode = {
          id: IdService.generate(),
          parentId: action.parentId,
          description: result.description,
          disciplineIds: result.disciplineIds,
          title: result.title,
          _ts: 0,
          order,
        };

        return this.saveTask(ctx, model).pipe(
          map(() => {
            nodes.push(model);

            ctx.patchState({
              nodes,
            });
          }),
          switchMap(() => ctx.dispatch(new RebuildNodeViews())),
          switchMap(() =>
            this.saveActivity(ctx, {
              data: [model.title],
              objectId: model.id,
              action: TASK_ACTIONS.SUB_TASK_CREATED,
              labelTitle: 'Actions.SubTaskCreated',
            })
          ),
          tap(() => this.messages.success('Projects.TaskTitleUpdated'))
        );
      })
    );
  }

  private copy<T>(x: T): T {
    return <T>JSON.parse(JSON.stringify(x));
  }

  private sortActivity(a: Activity, b: Activity): number {
    return a.timestamp - b.timestamp;
  }

  private saveActivity(
    ctx: StateContext<StateModel>,
    data: ActivityData
  ): Observable<void> {
    const state = ctx.getState();
    const project = state.current!;
    return this.data.activities.putAsync(project.id, data).pipe(
      map((activity) => {
        ctx.patchState({
          activity: [activity, ...(state.activity ?? [])],
        });
      })
    );
  }

  private saveProject(
    ctx: StateContext<StateModel>,
    project: Project
  ): Observable<void> {
    return this.data.projects.putAsync(project).pipe(
      tap(() => ctx.patchState({ current: project })),
      switchMap(() => this.projectChanged(ctx))
    );
  }

  private saveTask(
    ctx: StateContext<StateModel>,
    task: WbsNode
  ): Observable<void> {
    const project = ctx.getState().current!;

    return this.data.projectNodes.putAsync(project.id, task).pipe(
      tap(() => (task._ts = new Date().getTime())),
      switchMap(() => this.projectChanged(ctx))
    );
  }

  saveReordered(
    ctx: StateContext<StateModel>,
    projectId: string,
    mainTask: WbsNode,
    others: WbsNode[]
  ): Observable<void> {
    return this.data.projectNodes
      .batchAsync(projectId, [mainTask, ...others], [])
      .pipe(
        tap(() => {
          const tasks = ctx.getState().nodes!;

          for (const task of [mainTask, ...others]) {
            const index = tasks.findIndex((x) => x.id === task.id);

            if (index > -1) tasks[index] = task;
            else tasks.push(task);
          }
          ctx.patchState({
            nodes: tasks,
          });
        }),
        switchMap(() => ctx.dispatch(new RebuildNodeViews())),
        switchMap(() =>
          this.saveActivity(ctx, {
            data: [mainTask.title],
            objectId: mainTask.id,
            action: TASK_ACTIONS.REORDERED,
            labelTitle: 'Actions.TaskRecordered',
          })
        ),
        tap(() => this.messages.success('Projects.TaskReordered'))
      );
  }

  private projectChanged(ctx: StateContext<StateModel>): Observable<void> {
    const project = ctx.getState().current!;

    project._ts = new Date().getTime();

    ctx.patchState({
      current: project,
    });

    return ctx.dispatch(new ProjectUpdated(project));
  }
}
