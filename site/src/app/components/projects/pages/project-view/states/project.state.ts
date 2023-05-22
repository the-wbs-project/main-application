import { inject, Injectable } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { ProjectUpdated, SetHeaderInfo } from '@wbs/core/actions';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  ActivityData,
  Project,
  PROJECT_NODE_VIEW,
  PROJECT_STATI,
  ProjectCategory,
  ROLES,
} from '@wbs/core/models';
import { DialogService, Messages, WbsTransformers } from '@wbs/core/services';
import { AuthState, MetadataState, OrganizationState } from '@wbs/core/states';
import { Observable, of, switchMap, tap } from 'rxjs';
import {
  AddUserToRole,
  ChangeProjectBasics,
  ChangeProjectCategories,
  MarkProjectChanged,
  NavigateToView,
  PerformChecklist,
  RebuildNodeViews,
  RemoveUserToRole,
  SaveTimelineAction,
  SetProject,
  VerifyProject,
  VerifyTasks,
} from '../actions';
import { PROJECT_ACTIONS } from '../models';
import {
  ProjectHelperService,
  ProjectManagementService,
} from '../../../services';
import { UserRolesViewModel } from '../view-models';

interface StateModel {
  approvers?: string[];
  current?: Project;
  roles?: string[];
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
  static canSubmit(state: StateModel): boolean {
    return (
      state.current?.status === PROJECT_STATI.PLANNING &&
      (state.roles ?? []).indexOf(ROLES.PM) > -1
    );
  }

  @Selector()
  static current(state: StateModel): Project | undefined {
    return state.current;
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
  static phaseIds(state: StateModel): string[] {
    return (
      state.current?.categories?.phase?.map((x) =>
        typeof x === 'string' ? x : x.id
      ) ?? []
    );
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
  ): Observable<any> {
    const userId = this.store.selectSnapshot(AuthState.userId);

    return this.data.projects.getAsync(projectId).pipe(
      tap((project) =>
        ctx.patchState({
          current: project,
          roles:
            project.roles
              ?.filter((x) => x.userId === userId)
              ?.map((x) => x.role) ?? [],
        })
      ),
      tap(() => this.updateUsers(ctx)),
      tap(() => this.updateUserRoles(ctx)),
      tap((project) =>
        ctx.dispatch([
          new VerifyTasks(project),
          new SetHeaderInfo({
            title: 'Projects.ProjectDetails',
            titleIsResource: true,
            breadcrumbs: [{ route: '', label: 'General.Projects' }],
            activeItem: project.title,
          }),
        ])
      ),
      tap((project) =>
        ctx.dispatch(new PerformChecklist(project, undefined, undefined))
      )
    );
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

  @Action(ChangeProjectBasics)
  changeProjectBasics(
    ctx: StateContext<StateModel>,
    action: ChangeProjectBasics
  ): Observable<void> | void {
    const state = ctx.getState();
    const project = state.current!;
    const activities: ActivityData[] = [];

    if (project.title !== action.title) {
      activities.push({
        action: PROJECT_ACTIONS.TITLE_CHANGED,
        data: {
          from: project.title,
          to: action.title,
        },
      });
    }

    if (project.description !== action.description) {
      activities.push({
        action: PROJECT_ACTIONS.DESCRIPTION_CHANGED,
        data: {
          from: project.description,
          to: action.description,
        },
      });
    }

    if (project.category !== action.category) {
      activities.push({
        action: PROJECT_ACTIONS.CATEGORY_CHANGED,
        data: {
          from: this.getCatName(project.category),
          to: this.getCatName(action.category),
        },
      });
    }
    //
    //  If no activities then nothing actually changed
    //
    if (activities.length === 0) return;

    project.title = action.title;
    project.description = action.description;
    project.category = action.category;

    return this.saveProject(ctx, project).pipe(
      tap(() => this.messaging.success('Projects.ProjectUpdated')),
      tap(() => this.saveActivity(ctx, ...activities))
    );
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
      tap(() => ctx.dispatch(new RebuildNodeViews())),
      tap(() =>
        this.saveActivity(ctx, {
          action: saveAction,
          data: {
            from: originalList,
            to: action.categories,
          },
        })
      )
    );
  }

  @Action(MarkProjectChanged)
  markProjectChanged(ctx: StateContext<StateModel>): Observable<void> {
    return this.projectChanged(ctx);
  }

  private saveActivity(
    ctx: StateContext<StateModel>,
    ...data: ActivityData[]
  ): Observable<void> {
    return ctx.dispatch(new SaveTimelineAction(data, 'project'));
  }

  private saveProject(
    ctx: StateContext<StateModel>,
    project: Project
  ): Observable<void> {
    return this.data.projects.putAsync(project).pipe(
      tap(() => ctx.patchState({ current: project })),
      tap(() => this.projectChanged(ctx)),
      tap(() =>
        ctx.dispatch(new PerformChecklist(project, undefined, undefined))
      )
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

  private getCatName(idsOrCat: ProjectCategory | null | undefined): string {
    if (!idsOrCat) return '';
    if (typeof idsOrCat === 'string')
      return (
        this.store.selectSnapshot(MetadataState.categoryNames).get(idsOrCat) ??
        ''
      );

    return idsOrCat.label;
  }
}
