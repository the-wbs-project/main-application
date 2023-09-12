import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Member, Organization, Project } from '@wbs/core/models';
import { Messages, sorter } from '@wbs/core/services';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import {
  ChangeOrganization,
  InitiateOrganizations,
  ProjectUpdated,
  UpdateMembers,
} from '../actions';
import { UserService } from '../services';

interface MembershipStateModel {
  list?: Organization[];
  loading: boolean;
  organization?: Organization;
  projects?: Project[];
  members?: Member[];
}

declare type Context = StateContext<MembershipStateModel>;

@Injectable()
@State<MembershipStateModel>({
  name: 'membership',
  defaults: {
    loading: true,
  },
})
export class MembershipState {
  constructor(
    protected readonly data: DataServiceFactory,
    protected readonly messages: Messages,
    protected readonly userService: UserService
  ) {}

  @Selector()
  static list(state: MembershipStateModel): Organization[] | undefined {
    return state.list;
  }

  @Selector()
  static loading(state: MembershipStateModel): boolean {
    return state.loading;
  }

  @Selector()
  static organization(state: MembershipStateModel): Organization | undefined {
    return state.organization;
  }

  @Selector()
  static projects(state: MembershipStateModel): Project[] | undefined {
    return state.projects;
  }

  @Selector()
  static members(state: MembershipStateModel): Member[] | undefined {
    return state.members;
  }

  @Action(InitiateOrganizations)
  initiateOrganizations(
    ctx: Context,
    { organizations }: InitiateOrganizations
  ): Observable<any> {
    ctx.patchState({ loading: true, list: organizations });

    return ctx.dispatch(new ChangeOrganization(organizations[0]));
  }

  @Action(ChangeOrganization)
  changeOrganization(
    ctx: Context,
    { organization }: ChangeOrganization
  ): Observable<void> {
    ctx.patchState({
      loading: true,
      organization,
    });
    return this.data.projects.getAllAsync(organization.name).pipe(
      map((projects) => {
        ctx.patchState({
          projects: projects.sort((a, b) =>
            sorter(a.lastModified, b.lastModified, 'desc')
          ),
        });
      }),
      tap(() => ctx.patchState({ loading: false })),
      switchMap(() =>
        this.data.memberships.getMembershipUsersAsync(organization.name)
      ),
      map((members) => {
        ctx.patchState({
          members: members.sort((a, b) => sorter(a.name, b.name)),
        });
        this.userService.addUsers(members);
      })
    );
  }

  @Action(ProjectUpdated)
  projectUpdated(ctx: Context, { project }: ProjectUpdated): void {
    const state = ctx.getState();
    const projects = [...(state.projects ?? [])];
    const index = projects.findIndex((x) => x.id === project.id);

    if (index > -1) projects.splice(index, 1);

    projects.splice(0, 0, project);

    ctx.patchState({ projects });
  }

  @Action(UpdateMembers)
  updateMembers(ctx: Context, { members }: UpdateMembers): void {
    ctx.patchState({ members });
  }
}
