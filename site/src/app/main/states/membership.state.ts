import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Member, Organization, Project } from '@wbs/core/models';
import { sorter } from '@wbs/core/services';
import { Observable, forkJoin } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  ChangeOrganization,
  LoadOrganizations,
  ProjectUpdated,
  RemoveMemberFromOrganization,
} from '../actions';

interface StateModel {
  list?: Organization[];
  loading: boolean;
  organization?: Organization;
  projects?: Project[];
  roles?: string[];
  members?: Member[];
}

@Injectable()
@State<StateModel>({
  name: 'membership',
  defaults: {
    loading: true,
  },
})
export class MembershipState {
  constructor(private readonly data: DataServiceFactory) {}

  @Selector()
  static id(state: StateModel): string | undefined {
    return state.organization?.id;
  }

  @Selector()
  static list(state: StateModel): Organization[] | undefined {
    return state.list;
  }

  @Selector()
  static loading(state: StateModel): boolean {
    return state.loading;
  }

  @Selector()
  static organization(state: StateModel): Organization | undefined {
    return state.organization;
  }

  @Selector()
  static projects(state: StateModel): Project[] | undefined {
    return state.projects;
  }

  @Selector()
  static roles(state: StateModel): string[] | undefined {
    return state.roles;
  }

  @Selector()
  static members(state: StateModel): Member[] | undefined {
    return state.members;
  }

  @Action(LoadOrganizations)
  loadOrganization(ctx: StateContext<StateModel>): Observable<any> {
    ctx.patchState({ loading: true });

    return this.data.memberships.getMembershipsAsync().pipe(
      map((list) => list.sort((a, b) => sorter(a.name, b.name))),
      tap((list) => ctx.patchState({ list })),
      tap((list) => ctx.dispatch(new ChangeOrganization(list[0])))
    );
  }

  @Action(ChangeOrganization)
  changeOrganization(
    ctx: StateContext<StateModel>,
    { organization }: ChangeOrganization
  ): Observable<void> {
    ctx.patchState({ organization, loading: true });

    return forkJoin({
      roles: this.data.memberships.getMembershipRolesAsync(organization.id),
      users: this.data.memberships.getMembershipUsersAsync(organization.id),
      projects: this.data.projects.getAllAsync(organization.name),
    }).pipe(
      map(({ projects, roles, users }) => {
        ctx.patchState({
          roles,
          projects: projects.sort((a, b) =>
            sorter(a.lastModified, b.lastModified, 'desc')
          ),
          members: users.sort((a, b) => sorter(a.name, b.name)),
        });
      }),
      tap(() => ctx.patchState({ loading: false }))
    );
  }

  @Action(ProjectUpdated)
  projectUpdated(
    ctx: StateContext<StateModel>,
    { project }: ProjectUpdated
  ): void {
    const state = ctx.getState();
    const projects = [...(state.projects ?? [])];
    const index = projects.findIndex((x) => x.id === project.id);

    if (index > -1) projects.splice(index, 1);

    projects.splice(0, 0, project);

    ctx.patchState({ projects });
  }

  @Action(RemoveMemberFromOrganization)
  removeMember(
    ctx: StateContext<StateModel>,
    { memberId }: RemoveMemberFromOrganization
  ): Observable<void> {
    const state = ctx.getState();

    return this.data.memberships
      .removeUserFromOrganizationAsync(state.organization!.id, memberId)
      .pipe(
        tap(() => {
          const members = [...(state.members ?? [])];
          const index = members.findIndex((x) => x.id === memberId);

          if (index > -1) members.splice(index, 1);

          ctx.patchState({ members });
        })
      );
  }
}
