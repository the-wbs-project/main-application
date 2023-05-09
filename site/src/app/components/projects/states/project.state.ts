import { inject, Injectable } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { ProjectUpdated, SetHeaderInfo } from '@wbs/core/actions';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  ActivityData,
  Project,
  PROJECT_NODE_VIEW,
  ProjectCategory,
  ROLES,
  WbsNode,
} from '@wbs/core/models';
import {
  DialogService,
  HeaderService,
  IdService,
  Messages,
  WbsTransformers,
} from '@wbs/core/services';
import { AuthState, OrganizationState } from '@wbs/core/states';
import { WbsNodeView } from '@wbs/core/view-models';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import {
  AddUserToRole,
  ChangeProjectBasics,
  ChangeProjectCategories,
  ChangeTaskDescription,
  ChangeTaskTitle,
  CloneTask,
  CreateTask,
  MoveTaskDown,
  MoveTaskLeft,
  MoveTaskRight,
  MoveTaskUp,
  NavigateToTask,
  NavigateToView,
  RebuildNodeViews,
  RemoveTask,
  RemoveUserToRole,
  SaveTimelineAction,
  SaveUpload,
  SetProject,
  TreeReordered,
  VerifyProject,
} from '../actions';
import { PROJECT_ACTIONS, TASK_ACTIONS } from '../models';
import { ProjectHelperService, ProjectManagementService } from '../services';
import { UserRolesViewModel } from '../pages/project-view/view-models';

interface StateModel {
  approvers?: string[];
  current?: Project;
  disciplines?: WbsNodeView[];
  roles?: string[];
  nodes?: WbsNode[];
  phases?: WbsNodeView[];
  pms?: string[];
  smes?: string[];
  users?: UserRolesViewModel[];
}

@Injectable()
@State<StateModel>({
  name: 'project',
  defaults: {},
})
export class ProjectState {
  private data = inject(DataServiceFactory);
  private dialog = inject(DialogService);
  private header = inject(HeaderService);
  private helper = inject(ProjectHelperService);
  private messaging = inject(Messages);
  private service = inject(ProjectManagementService);
  private store = inject(Store);
  private readonly transformers = inject(WbsTransformers);

  @Selector()
  static approvers(state: StateModel): string[] | undefined {
    return state.approvers;
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
  static disciplineIds(state: StateModel): string[] {
    return (
      state.current?.categories?.discipline?.map((x) =>
        typeof x === 'string' ? x : x.id
      ) ?? []
    );
  }

  @Selector()
  static nodes(state: StateModel): WbsNode[] | undefined {
    return state.nodes;
  }

  @Selector()
  static phaseIds(state: StateModel): string[] {
    return (
      state.current?.categories?.phase?.map((x) =>
        typeof x === 'string' ? x : x.id
      ) ?? []
    );
  }

  @Selector()
  static phases(state: StateModel): WbsNodeView[] | undefined {
    return state.phases;
  }

  @Selector()
  static pms(state: StateModel): string[] | undefined {
    return state.pms;
  }

  @Selector()
  static roles(state: StateModel): string[] | undefined {
    return state.roles;
  }

  @Selector()
  static smes(state: StateModel): string[] | undefined {
    return state.smes;
  }

  @Selector()
  static users(state: StateModel): UserRolesViewModel[] | undefined {
    return state.users;
  }

  @Action(VerifyProject)
  verifyProject(
    ctx: StateContext<StateModel>,
    { projectId }: VerifyProject
  ): Observable<void> {
    const state = ctx.getState();

    return state.current?.id !== projectId
      ? ctx.dispatch(new SetProject(projectId))
      : of();
  }

  @Action(NavigateToView)
  navigateToView(
    ctx: StateContext<StateModel>,
    { view }: NavigateToView
  ): Observable<void> {
    const state = ctx.getState();

    return ctx.dispatch(
      new Navigate(['/projects', state.current!.id, 'view', view])
    );
  }

  @Action(SetProject)
  setProject(
    ctx: StateContext<StateModel>,
    { projectId }: SetProject
  ): Observable<void> {
    const userId = this.store.selectSnapshot(AuthState.userId);

    return forkJoin({
      project: this.data.projects.getAsync(projectId),
      nodes: this.data.projectNodes.getAllAsync(projectId),
    }).pipe(
      tap((data) =>
        ctx.patchState({
          current: data.project,
          nodes: data.nodes?.filter((x) => !x.removed) ?? [],
          roles:
            data.project.roles
              ?.filter((x) => x.userId === userId)
              ?.map((x) => x.role) ?? [],
        })
      ),
      tap(() => this.updateUsers(ctx)),
      tap(() => this.updateUserRoles(ctx)),
      switchMap((data) =>
        ctx.dispatch([
          new RebuildNodeViews(),
          new SetHeaderInfo({
            title: 'Projects.ProjectDetails',
            titleIsResource: true,
            breadcrumbs: [{ route: '', label: 'General.Projects' }],
            activeItem: data.project.title,
          }),
        ])
      )
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

  @Action(AddUserToRole)
  addUserToRole(
    ctx: StateContext<StateModel>,
    { role, user }: AddUserToRole
  ): Observable<void> {
    const project = ctx.getState().current!;
    const roleTitle = this.helper.getRoleTitle(role, false);

    return this.dialog
      .confirm('General.Confirmation', 'ProjectSettings.AddUserConfirmation', {
        ROLE_NAME: roleTitle,
        USER_NAME: user.name,
      })
      .pipe(
        switchMap((answer) => {
          if (!answer) return of();

          project.roles.push({
            role,
            userId: user.id,
          });

          return this.saveProject(ctx, project).pipe(
            tap(() => this.messaging.success('ProjectSettings.UserAdded')),
            tap(() => this.updateUsers(ctx)),
            tap(() => this.updateUserRoles(ctx)),
            switchMap(() =>
              this.saveActivity(ctx, {
                action: PROJECT_ACTIONS.ADDED_USER,
                data: {
                  role: roleTitle,
                  user: user.name,
                },
              })
            )
          );
        })
      );
  }

  @Action(RemoveUserToRole)
  removeUserToRole(
    ctx: StateContext<StateModel>,
    { role, user }: RemoveUserToRole
  ): Observable<void> {
    const project = ctx.getState().current!;
    const roleTitle = this.helper.getRoleTitle(role, false);
    const index = project.roles.findIndex(
      (x) => x.role === role && x.userId === user.id
    );

    if (index === -1) return of();

    return this.dialog
      .confirm(
        'General.Confirmation',
        'ProjectSettings.RemoveUserConfirmation',
        {
          ROLE_NAME: roleTitle,
          USER_NAME: user.name,
        }
      )
      .pipe(
        switchMap((answer) => {
          if (!answer) return of();

          project.roles.splice(index, 1);

          return this.saveProject(ctx, project).pipe(
            tap(() => this.messaging.success('ProjectSettings.UserRemoved')),
            tap(() => this.updateUsers(ctx)),
            tap(() => this.updateUserRoles(ctx)),
            switchMap(() =>
              this.saveActivity(ctx, {
                action: PROJECT_ACTIONS.REMOVED_USER,
                data: {
                  role: roleTitle,
                  user: user.name,
                },
              })
            )
          );
        })
      );
  }

  @Action(RemoveTask)
  removeNodeToProject(
    ctx: StateContext<StateModel>,
    action: RemoveTask
  ): Observable<any> | void {
    const state = ctx.getState();
    const parentId = state.current!.id;
    const changed: Observable<void>[] = [];
    const nodes = this.copy(state.nodes)!;
    const nodeIndex = nodes.findIndex((x) => x.id === action.nodeId);

    if (nodeIndex === -1) return of();

    nodes[nodeIndex].removed = true;

    let changedIds: string[] = [
      action.nodeId,
      ...this.transformers.nodes.phase.reorderer.run(state.current!, nodes),
    ];

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
        this.saveActivity(ctx, {
          action: TASK_ACTIONS.REMOVED,
          data: {
            title: nodes[nodeIndex].title,
            reason: action.reason,
          },
          objectId: action.nodeId,
        })
      ),
      switchMap(() =>
        action.completedAction ? ctx.dispatch(action.completedAction) : of()
      )
    );
  }

  @Action(ChangeProjectBasics)
  changeProjectBasics(
    ctx: StateContext<StateModel>,
    action: ChangeProjectBasics
  ): Observable<any> {
    const state = ctx.getState();
    const project = state.current!;
    const original = project.title;

    project.title = action.title;
    project.description = action.description;
    project.category = action.category;

    return this.saveProject(ctx, project).pipe(
      tap(() => this.messaging.success('Projects.UpdatedProject')),
      switchMap(() =>
        this.saveActivity(ctx, {
          action: PROJECT_ACTIONS.TITLE_CHANGED,
          data: {
            from: original,
            to: action.title,
          },
        })
      )
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
    const nodeVm = state.phases!.find((x) => x.id === action.nodeId);
    const now = Date.now();

    if (node == null) return;

    const order =
      Math.max(
        ...nodes
          .filter((x) => x.parentId === node?.parentId)
          .map((x) => x.order)
      ) + 1;

    const newNode: WbsNode = {
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
      switchMap(() =>
        this.saveActivity(ctx, {
          data: {
            title: node.title,
            level: nodeVm!.levelText,
          },
          objectId: newNode.id,
          action: TASK_ACTIONS.CLONED,
        })
      ),
      tap(() => this.messaging.success('Projects.TaskCloned'))
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
    const taskVm = state.phases!.find((x) => x.id === action.taskId);
    const task2 = tasks.find(
      (x) => x.parentId === task?.parentId && x.order === task.order + 1
    );
    if (!task || !task2) return;

    task.order++;
    task2.order--;

    return this.saveReordered(ctx, state.current!.id, taskVm!.levelText, task, [
      task2,
    ]);
  }

  @Action(MoveTaskLeft)
  moveTaskLeft(
    ctx: StateContext<StateModel>,
    action: MoveTaskLeft
  ): void | Observable<void> {
    const state = ctx.getState();
    const tasks = this.copy(state.nodes)!;
    const task = tasks.find((x) => x.id === action.taskId);
    const taskVm = state.phases!.find((x) => x.id === action.taskId);
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
    return this.saveReordered(
      ctx,
      state.current!.id,
      taskVm!.levelText,
      task,
      toSave
    );
  }

  @Action(MoveTaskRight)
  moveTaskRight(
    ctx: StateContext<StateModel>,
    action: MoveTaskRight
  ): void | Observable<void> {
    const state = ctx.getState();
    const tasks = this.copy(state.nodes)!;
    const task = tasks.find((x) => x.id === action.taskId);
    const taskVm = state.phases!.find((x) => x.id === action.taskId);
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

    return this.saveReordered(
      ctx,
      state.current!.id,
      taskVm!.levelText,
      task,
      toSave
    );
  }

  @Action(MoveTaskUp)
  moveTaskUp(
    ctx: StateContext<StateModel>,
    action: MoveTaskUp
  ): void | Observable<void> {
    const state = ctx.getState();
    const tasks = this.copy(state.nodes)!;
    const task = tasks.find((x) => x.id === action.taskId);
    const taskVm = state.phases!.find((x) => x.id === action.taskId);
    const task2 = tasks.find(
      (x) => x.parentId === task?.parentId && x.order === task.order - 1
    );
    if (!task || !task2) return;

    task.order--;
    task2.order++;

    return this.saveReordered(ctx, state.current!.id, taskVm!.levelText, task, [
      task2,
    ]);
  }

  @Action(ChangeProjectCategories)
  changeProjectCategories(
    ctx: StateContext<StateModel>,
    action: ChangeProjectCategories
  ): Observable<any> {
    const state = ctx.getState();
    const project = state.current!;
    let originalList: ProjectCategory[];
    let saveMessage: string;
    let saveAction: string;

    const isPhases = action.cType === PROJECT_NODE_VIEW.PHASE;

    if (action.cType === PROJECT_NODE_VIEW.PHASE) {
      saveMessage = 'Projects.ProjectPhasesUpdated';
      saveAction = PROJECT_ACTIONS.PHASES_CHANGED;

      originalList = [...project.categories.phase];

      project.categories.phase = action.categories;
    } else {
      saveMessage = 'Projects.ProjectDisciplinesUpdated';
      saveAction = PROJECT_ACTIONS.DISCIPLINES_CHANGED;

      originalList = [...project.categories.discipline];

      project.categories.discipline = action.categories;
    }

    return this.saveProject(ctx, project).pipe(
      tap(() => this.messaging.success(saveMessage)),
      switchMap(() =>
        this.saveActivity(ctx, {
          action: saveAction,
          data: {
            from: originalList,
            to: action.categories,
          },
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

    const original = node.title;
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
          data: {
            from: original,
            to: node.title,
          },
          objectId: action.taskId,
          action: TASK_ACTIONS.TITLE_CHANGED,
        })
      ),
      tap(() => this.messaging.success('Projects.TaskTitleUpdated'))
    );
  }

  @Action(ChangeTaskDescription)
  changeTaskDescription(
    ctx: StateContext<StateModel>,
    action: ChangeTaskDescription
  ): Observable<void> | void {
    const nodes = ctx.getState().nodes;

    if (!nodes) return;

    const index = nodes.findIndex((x) => x.id === action.taskId);

    if (index === -1) return;

    let node = this.copy(nodes[index]);

    const original = node.description;
    node.description = action.description;

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
          data: {
            from: original,
            to: action.description,
          },
          objectId: action.taskId,
          action: TASK_ACTIONS.DESCRIPTION_CHANGED,
        })
      ),
      tap(() => this.messaging.success('Projects.TaskDescriptionUpdated'))
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
    const taskVm = state.phases!.find((x) => x.id === action.draggedId);

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
      taskVm!.levelText,
      upserts.find((x) => x.id === action.draggedId)!,
      upserts.filter((x) => x.id !== action.draggedId)
    );
  }

  @Action(SaveUpload)
  saveUpload(
    ctx: StateContext<StateModel>,
    { results }: SaveUpload
  ): void | Observable<any> {
    const state = ctx.getState();
    const project = state.current!;

    project.categories.phase = results.phases;
    project.categories.discipline = results.disciplines;

    const saves: Observable<any>[] = [
      this.saveProject(ctx, project).pipe(
        tap(() =>
          ctx.patchState({
            current: project,
          })
        )
      ),
    ];

    if (results.removeIds.length > 0 || results.upserts.length > 0) {
      saves.push(
        this.data.projectNodes
          .batchAsync(project.id, results.upserts, results.removeIds)
          .pipe(
            tap(() => {
              const nodes = ctx.getState().nodes!;

              for (const id of results.removeIds) {
                const index = nodes.findIndex((x) => x.id === id);

                if (index > -1) nodes.splice(index, 1);
              }
              for (const node of results.upserts) {
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

    if (saves.length === 0) return;

    return forkJoin(saves).pipe(
      tap(() => ctx.dispatch(new RebuildNodeViews()))
    );
  }

  @Action(CreateTask)
  createTask(
    ctx: StateContext<StateModel>,
    action: CreateTask
  ): Observable<any> {
    const state = ctx.getState();
    const nodes = state.nodes!;
    const model = this.service.createTask(action.parentId, action.model, nodes);

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
          data: {
            title: model.title,
          },
          objectId: model.id,
          action: TASK_ACTIONS.CREATED,
        })
      ),
      tap(() => this.messaging.success('Projects.TaskCreated')),
      switchMap(() =>
        action.navigateTo ? ctx.dispatch(new NavigateToTask(model.id)) : of()
      )
    );
  }

  private copy<T>(x: T): T {
    return <T>JSON.parse(JSON.stringify(x));
  }

  private saveActivity(
    ctx: StateContext<StateModel>,
    data: ActivityData
  ): Observable<void> {
    return ctx.dispatch(
      new SaveTimelineAction(
        {
          ...data,
        },
        'project'
      )
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

    task.lastModified = Date.now();

    return this.data.projectNodes
      .putAsync(project.id, task)
      .pipe(switchMap(() => this.projectChanged(ctx)));
  }

  saveReordered(
    ctx: StateContext<StateModel>,
    projectId: string,
    originalLevel: string,
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
        switchMap(() => {
          const newVm = ctx
            .getState()
            .phases!.find((x) => x.id === mainTask.id);

          return this.saveActivity(ctx, {
            data: {
              title: mainTask.title,
              from: originalLevel,
              to: newVm?.levelText,
            },
            objectId: mainTask.id,
            action: TASK_ACTIONS.REORDERED,
          });
        }),
        tap(() => this.messaging.success('Projects.TaskReordered')),
        switchMap(() => this.projectChanged(ctx))
      );
  }

  private projectChanged(ctx: StateContext<StateModel>): Observable<void> {
    const project = ctx.getState().current!;

    project.lastModified = Date.now();

    ctx.patchState({
      current: project,
    });

    return ctx.dispatch(new ProjectUpdated(project));
  }

  private updateUserRoles(ctx: StateContext<StateModel>) {
    const project = ctx.getState().current;
    const approvers: string[] = [];
    const pms: string[] = [];
    const smes: string[] = [];

    if (project)
      for (const ur of project.roles) {
        if (ur.role === ROLES.APPROVER) approvers.push(ur.userId);
        else if (ur.role === ROLES.PM) pms.push(ur.userId);
        else if (ur.role === ROLES.SME) smes.push(ur.userId);
      }

    ctx.patchState({ approvers, pms, smes });
  }

  private updateUsers(ctx: StateContext<StateModel>): void {
    const project = ctx.getState().current!;
    const userList = this.store.selectSnapshot(OrganizationState.users);
    const users: UserRolesViewModel[] = [];

    for (const user of userList) {
      const roles = project.roles.filter((x) => x.userId === user.id);

      if (roles.length === 0) continue;

      users.push({
        email: user.email,
        name: user.name,
        id: user.id,
        roles: roles.map((x) => x.role),
      });
    }

    ctx.patchState({ users });
  }
}
