import { Injectable } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  ActivityData,
  Project,
  PROJECT_NODE_VIEW,
  ProjectCategory,
} from '@wbs/core/models';
import { Messages, ProjectService, Resources } from '@wbs/core/services';
import {
  AuthState,
  MembershipState,
  MetadataState,
  RoleState,
} from '@wbs/main/states';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PROJECT_ACTIONS } from '../../../models';
import {
  AddUserToRole,
  ChangeProjectBasics,
  ChangeProjectCategories,
  ChangeProjectStatus,
  MarkProjectChanged,
  NavigateToView,
  RebuildNodeViews,
  RemoveDisciplinesFromTasks,
  RemoveUserToRole,
  SetChecklistData,
  SetProject,
  VerifyProject,
  VerifyTasks,
} from '../actions';
import { TimelineService } from '../services';
import { UserRolesViewModel } from '../view-models';

interface StateModel {
  approvers?: string[];
  current?: Project;
  roles?: string[];
  pms?: string[];
  smes?: string[];
  users?: UserRolesViewModel[];
}

declare type Context = StateContext<StateModel>;

@Injectable()
@State<StateModel>({
  name: 'project',
  defaults: {},
})
export class ProjectState {
  constructor(
    private readonly data: DataServiceFactory,
    private readonly messaging: Messages,
    private readonly resources: Resources,
    private readonly services: ProjectService,
    private readonly store: Store,
    private readonly timeline: TimelineService
  ) {}

  @Selector()
  static approvers(state: StateModel): string[] | undefined {
    return state.approvers;
  }

  @Selector()
  static current(state: StateModel): Project | undefined {
    return state.current;
  }

  @Selector()
  static disciplineIds(state: StateModel): string[] {
    return (
      state.current?.disciplines?.map((x) =>
        typeof x === 'string' ? x : x.id
      ) ?? []
    );
  }

  @Selector()
  static phaseIds(state: StateModel): string[] {
    return (
      state.current?.phases?.map((x) => (typeof x === 'string' ? x : x.id)) ??
      []
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
    ctx: Context,
    { owner, projectId }: VerifyProject
  ): Observable<void> {
    const state = ctx.getState();

    return state.current?.id !== projectId
      ? ctx.dispatch(new SetProject(owner, projectId))
      : of(); //.pipe(tap(() => ctx.dispatch(new VerifyTasks(state.current!))));
  }

  @Action(NavigateToView)
  navigateToView(ctx: Context, { view }: NavigateToView): Observable<void> {
    const state = ctx.getState();

    return ctx.dispatch(
      new Navigate(['/projects', state.current!.id, 'view', view])
    );
  }

  @Action(SetProject)
  setProject(ctx: Context, { owner, projectId }: SetProject): Observable<any> {
    const userId = this.store.selectSnapshot(AuthState.userId);
    const roles: string[] = [];

    return this.data.projects.getAsync(owner, projectId).pipe(
      tap((project) => this.verifyRoles(project)),
      tap((project) => {
        for (const role of project!.roles.filter((x) => x.userId === userId)) {
          roles.push(role.role);
        }
        ctx.patchState({
          current: project,
          roles,
        });
      }),
      tap(() => this.updateUsers(ctx)),
      tap(() => this.updateUserRoles(ctx)),
      tap((project) => ctx.dispatch([new VerifyTasks(project)])),
      tap((project) =>
        ctx.dispatch(new SetChecklistData(project, undefined, undefined))
      ),
      tap(() => this.clearClaimCache())
    );
  }

  @Action(AddUserToRole)
  addUserToRole(ctx: Context, { role, user }: AddUserToRole): Observable<void> {
    const project = ctx.getState().current!;
    const roleTitle = this.services.getRoleTitle(role, false);

    project.roles.push({
      role,
      userId: user.id,
    });

    return this.saveProject(ctx, project).pipe(
      tap(() => this.messaging.notify.success('ProjectSettings.UserAdded')),
      tap(() => this.updateUsers(ctx)),
      tap(() => this.updateUserRoles(ctx)),
      tap(() => this.clearClaimCache()),
      tap(() =>
        this.saveActivity({
          action: PROJECT_ACTIONS.ADDED_USER,
          topLevelId: project.id,
          data: {
            role: roleTitle,
            user: user.name,
          },
        })
      )
    );
  }

  @Action(RemoveUserToRole)
  removeUserToRole(
    ctx: Context,
    { role, user }: RemoveUserToRole
  ): Observable<void> {
    const project = ctx.getState().current!;
    const roleTitle = this.services.getRoleTitle(role, false);
    const index = project.roles.findIndex(
      (x) => x.role === role && x.userId === user.id
    );

    if (index === -1) return of();

    project.roles.splice(index, 1);

    return this.saveProject(ctx, project).pipe(
      tap(() => this.messaging.notify.success('ProjectSettings.UserRemoved')),
      tap(() => this.updateUsers(ctx)),
      tap(() => this.updateUserRoles(ctx)),
      tap(() => this.clearClaimCache()),
      tap(() =>
        this.saveActivity({
          action: PROJECT_ACTIONS.REMOVED_USER,
          topLevelId: project.id,
          data: {
            role: roleTitle,
            user: user.name,
          },
        })
      )
    );
  }

  @Action(ChangeProjectBasics)
  changeProjectBasics(
    ctx: Context,
    action: ChangeProjectBasics
  ): Observable<void> | void {
    const state = ctx.getState();
    const project = state.current!;
    const activities: ActivityData[] = [];

    if (project.title !== action.title) {
      activities.push({
        action: PROJECT_ACTIONS.TITLE_CHANGED,
        topLevelId: project.id,
        data: {
          from: project.title,
          to: action.title,
        },
      });
    }

    if (project.description !== action.description) {
      activities.push({
        action: PROJECT_ACTIONS.DESCRIPTION_CHANGED,
        topLevelId: project.id,
        data: {
          from: project.description,
          to: action.description,
        },
      });
    }

    if (project.category !== action.category) {
      activities.push({
        action: PROJECT_ACTIONS.CATEGORY_CHANGED,
        topLevelId: project.id,
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
      tap(() => this.messaging.notify.success('Projects.ProjectUpdated')),
      tap(() => this.saveActivity(...activities))
    );
  }

  @Action(ChangeProjectStatus)
  ChangeProjectStatus(
    ctx: Context,
    { status }: ChangeProjectStatus
  ): Observable<void> {
    const state = ctx.getState();
    const project = state.current!;
    const original = project.status;

    project.status = status;

    return this.saveProject(ctx, project).pipe(
      tap(() =>
        this.saveActivity({
          action: PROJECT_ACTIONS.STATUS_CHANGED,
          topLevelId: project.id,
          data: {
            from: original,
            to: status,
          },
        })
      )
    );
  }

  @Action(ChangeProjectCategories)
  changeProjectCategories(
    ctx: Context,
    { cType, changes }: ChangeProjectCategories
  ): Observable<any> {
    const state = ctx.getState();
    const project = state.current!;
    let originalList: ProjectCategory[];
    let saveMessage: string;
    let saveAction: string;

    if (cType === PROJECT_NODE_VIEW.PHASE) {
      saveMessage = 'Projects.ProjectPhasesUpdated';
      saveAction = PROJECT_ACTIONS.PHASES_CHANGED;

      originalList = [...project.phases];

      project.phases = changes.categories;
    } else {
      saveMessage = 'Projects.ProjectDisciplinesUpdated';
      saveAction = PROJECT_ACTIONS.DISCIPLINES_CHANGED;

      originalList = [...project.disciplines];

      project.disciplines = changes.categories;
    }

    return this.saveProject(ctx, project).pipe(
      tap(() => this.messaging.notify.success(saveMessage)),
      tap(() =>
        ctx.dispatch(
          cType === PROJECT_NODE_VIEW.DISCIPLINE &&
            changes.removedIds.length > 0
            ? new RemoveDisciplinesFromTasks(changes.removedIds)
            : new RebuildNodeViews()
        )
      ),
      tap(() =>
        this.saveActivity({
          action: saveAction,
          topLevelId: project.id,
          data: {
            from: originalList,
            to: changes.categories,
            removed: changes.removedIds,
          },
        })
      )
    );
  }

  @Action(MarkProjectChanged)
  markProjectChanged(ctx: Context): Observable<void> {
    return this.projectChanged(ctx);
  }

  private saveActivity(...data: ActivityData[]): void {
    this.timeline.saveProjectActions(
      data.map((x) => this.timeline.createProjectRecord(x))
    );
  }

  private saveProject(ctx: Context, project: Project): Observable<void> {
    return this.data.projects.putAsync(project).pipe(
      tap(() => ctx.patchState({ current: structuredClone(project) })),
      tap(() => this.projectChanged(ctx)),
      tap(() =>
        ctx.dispatch(new SetChecklistData(project, undefined, undefined))
      )
    );
  }

  private projectChanged(ctx: Context): Observable<void> {
    const project = ctx.getState().current!;

    project.lastModified = new Date();

    ctx.patchState({
      current: project,
    });

    return ctx.dispatch(new VerifyTasks(project, true));
  }

  private updateUserRoles(ctx: Context) {
    const project = ctx.getState().current;
    const approvers: string[] = [];
    const pms: string[] = [];
    const smes: string[] = [];
    const ids = this.store.selectSnapshot(RoleState.ids)!;

    if (project)
      for (const ur of project.roles) {
        if (ur.role === ids.approver) approvers.push(ur.userId);
        else if (ur.role === ids.pm) pms.push(ur.userId);
        else if (ur.role === ids.sme) smes.push(ur.userId);
      }

    ctx.patchState({ approvers, pms, smes });
  }

  private clearClaimCache(): void {
    this.data.claims.clearCache();
  }

  private updateUsers(ctx: Context): void {
    const project = ctx.getState().current!;
    const members = this.store.selectSnapshot(MembershipState.members) ?? [];
    const users: UserRolesViewModel[] = [];

    for (const user of members) {
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
      return this.resources.get(
        this.store.selectSnapshot(MetadataState.categoryNames).get(idsOrCat)!
      );

    return idsOrCat.label;
  }

  private verifyRoles(project: Project): void {
    if (!project.roles) {
      project.roles = [];
      return;
    }

    const definitions = this.store.selectSnapshot(RoleState.definitions);

    for (const role of project.roles) {
      const defByName = definitions.find((x) => x.name === role.role);

      if (defByName) {
        role.role = defByName.id;
        continue;
      }
    }
  }
}
