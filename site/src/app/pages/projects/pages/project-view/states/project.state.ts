import { Injectable, inject } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  ActivityData,
  Project,
  PROJECT_NODE_VIEW,
  PROJECT_STATI,
} from '@wbs/core/models';
import { CategoryService } from '@wbs/core/services';
import { ProjectViewModel, UserRolesViewModel } from '@wbs/core/view-models';
import { MetadataStore, UserStore } from '@wbs/core/store';
import { Observable, forkJoin, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { PROJECT_ACTIONS } from '../../../models';
import {
  AddUserToRole,
  ChangeProjectBasics,
  ChangeProjectDiscipines,
  ChangeProjectStatus,
  MarkProjectChanged,
  NavigateToView,
  RebuildNodeViews,
  RemoveDisciplinesFromTasks,
  RemoveUserToRole,
  SetChecklistData,
  SetProjectNavSection,
  SetProject,
  VerifyProject,
  VerifyTasks,
  SaveProject,
} from '../actions';
import { ProjectService, TimelineService } from '../services';

interface StateModel {
  model?: Project;
  claims: string[];
  current?: ProjectViewModel;
  navSection?: string;
  roles?: string[];
  users?: UserRolesViewModel[];
}

declare type Context = StateContext<StateModel>;

@Injectable()
@State<StateModel>({
  name: 'project',
  defaults: {
    claims: [],
  },
})
export class ProjectState {
  private readonly categoryService = inject(CategoryService);
  private readonly metadata = inject(MetadataStore);
  private readonly data = inject(DataServiceFactory);
  private readonly services = inject(ProjectService);
  private readonly timeline = inject(TimelineService);
  private readonly userId = inject(UserStore).userId;

  @Selector()
  static claims(state: StateModel): string[] {
    return state.claims;
  }

  @Selector()
  static current(state: StateModel): ProjectViewModel | undefined {
    return state.current;
  }

  @Selector()
  static navSection(state: StateModel): string | undefined {
    return state.navSection;
  }

  @Selector()
  static roles(state: StateModel): string[] | undefined {
    return state.roles;
  }

  @Selector()
  static users(state: StateModel): UserRolesViewModel[] | undefined {
    return state.users;
  }

  @Action(VerifyProject)
  verifyProject(
    ctx: Context,
    { owner, projectId }: VerifyProject
  ): Observable<void> | void {
    const state = ctx.getState();

    if (state.current?.id === projectId) return;

    return ctx.dispatch(new SetProject(owner, projectId));
  }

  @Action(NavigateToView)
  navigateToView(ctx: Context, { view }: NavigateToView): Observable<void> {
    const state = ctx.getState();

    return ctx.dispatch(
      new Navigate(['/projects', state.current!.id, 'view', view])
    );
  }

  @Action(SetProjectNavSection)
  setNavSection(ctx: Context, { navSection }: SetProjectNavSection): void {
    ctx.patchState({ navSection });
  }

  @Action(SetProject)
  setProject(ctx: Context, { owner, projectId }: SetProject): Observable<any> {
    const userId = this.userId()!;
    const roles: string[] = [];

    return forkJoin({
      project: this.data.projects.getAsync(owner, projectId),
      claims: this.data.claims.getProjectClaimsAsync(owner, projectId),
    }).pipe(
      tap((data) => this.verifyRoles(data.project)),
      tap((data) => {
        for (const role of data.project!.roles.filter(
          (x) => x.userId === userId
        )) {
          roles.push(role.role);
        }
        ctx.patchState({ model: data.project, claims: data.claims, roles });
      }),
      tap(() => this.setVm(ctx)),
      tap(() => ctx.dispatch([new VerifyTasks()])),
      tap((data) =>
        ctx.dispatch(new SetChecklistData(data.project, undefined, undefined))
      ),
      switchMap(() => this.updateUsers(ctx)),
      tap(() => this.clearClaimCache())
    );
  }

  @Action(SaveProject)
  saveProjectAction(ctx: Context, { project }: SaveProject): Observable<void> {
    return this.saveProject(ctx, this.fromVm(project));
  }

  @Action(AddUserToRole)
  addUserToRole(ctx: Context, { role, user }: AddUserToRole): Observable<void> {
    const project = ctx.getState().model!;
    const roleTitle = this.services.getRoleTitle(role, false);

    project.roles.push({ role, userId: user.id });

    return this.saveProject(ctx, project).pipe(
      switchMap(() => this.updateUsers(ctx)),
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
    const project = ctx.getState().model!;
    const roleTitle = this.services.getRoleTitle(role, false);
    const index = project.roles.findIndex(
      (x) => x.role === role && x.userId === user.id
    );

    if (index === -1) return of();

    project.roles.splice(index, 1);

    return this.saveProject(ctx, project).pipe(
      switchMap(() => this.updateUsers(ctx)),
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
    const project = state.model!;
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
      const cats = this.metadata.categories.projectCategories;

      activities.push({
        action: PROJECT_ACTIONS.CATEGORY_CHANGED,
        topLevelId: project.id,
        data: {
          from: cats.find((x) => x.id == project.category)?.label,
          to: cats.find((x) => x.id == action.category)?.label,
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
      tap(() => this.saveActivity(...activities))
    );
  }

  @Action(ChangeProjectStatus)
  changeProjectStatus(
    ctx: Context,
    { status }: ChangeProjectStatus
  ): Observable<void> {
    const state = ctx.getState();
    const project = state.model!;
    const original = project.status;

    project.status = status;

    if (status === PROJECT_STATI.APPROVAL) {
      //
      //  If the status is approval, set to true.  If its not true leave it alone (don't set to false).
      //
      project.approvalStarted = true;
    }

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

  @Action(ChangeProjectDiscipines)
  changeProjectDiscipines(
    ctx: Context,
    { changes }: ChangeProjectDiscipines
  ): Observable<any> {
    const state = ctx.getState();
    const project = state.model!;
    let originalList = [...project.disciplines];

    project.disciplines = changes.categories;

    return this.saveProject(ctx, project).pipe(
      tap(() =>
        ctx.dispatch(
          changes.removedIds.length > 0
            ? new RemoveDisciplinesFromTasks(changes.removedIds)
            : new RebuildNodeViews()
        )
      ),
      tap(() =>
        this.saveActivity({
          action: PROJECT_ACTIONS.DISCIPLINES_CHANGED,
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
      tap(() => ctx.patchState({ model: structuredClone(project) })),
      tap(() => this.setVm(ctx)),
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

    return ctx.dispatch(new VerifyTasks(true));
  }

  private clearClaimCache(): void {
    this.data.claims.clearCache();
  }

  private updateUsers(ctx: Context): Observable<any> {
    const project = ctx.getState().current!;

    return this.data.projects
      .getUsersAsync(project.owner, project.id)
      .pipe(tap((users) => ctx.patchState({ users })));
  }

  private verifyRoles(project: Project): void {
    if (!project.roles) {
      project.roles = [];
      return;
    }

    const definitions = this.metadata.roles.definitions;

    for (const role of project.roles) {
      const defByName = definitions.find((x) => x.name === role.role);

      if (defByName) {
        role.role = defByName.id;
        continue;
      }
    }
  }

  private fromVm(vm: ProjectViewModel): Project {
    return {
      approvalStarted: vm.approvalStarted,
      category: vm.category,
      createdOn: vm.createdOn,
      createdBy: vm.createdBy,
      description: vm.description,
      disciplines: this.categoryService.fromViewModels(vm.disciplines),
      id: vm.id,
      lastModified: vm.lastModified,
      owner: vm.owner,
      roles: vm.roles,
      status: vm.status,
      title: vm.title,
      mainNodeView: PROJECT_NODE_VIEW.PHASE,
    };
  }

  private setVm(ctx: Context): void {
    const project = ctx.getState().model!;
    const disciplines = this.categoryService.buildViewModels(
      project.disciplines
    );

    ctx.patchState({
      current: {
        approvalStarted: project.approvalStarted,
        category: project.category,
        createdOn: project.createdOn,
        createdBy: project.createdBy,
        description: project.description,
        disciplines,
        id: project.id,
        lastModified: project.lastModified,
        owner: project.owner,
        roles: project.roles,
        status: project.status,
        title: project.title,
      },
    });
  }
}
