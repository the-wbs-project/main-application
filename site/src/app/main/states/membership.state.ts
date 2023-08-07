import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Observable, forkJoin } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Organization, Role, UserLite } from '@wbs/core/models';
import { sorter } from '@wbs/core/services';
import {
  ChangeOrganization,
  LoadAllMembershipRoles,
  LoadOrganizations,
  LoadProjects,
} from '../actions';

interface StateModel {
  list?: Organization[];
  organization?: Organization;
  roles?: Role[];
  users?: UserLite[];
  userRoles?: Record<string, Role[]>;
}

@Injectable()
@State<StateModel>({
  name: 'membership',
  defaults: {},
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
  static organization(state: StateModel): Organization | undefined {
    return state.organization;
  }

  @Selector()
  static roles(state: StateModel): Role[] | undefined {
    return state.roles;
  }

  @Selector()
  static rolesIds(state: StateModel): string[] | undefined {
    return state.roles?.map((x) => x.id);
  }

  @Selector()
  static users(state: StateModel): UserLite[] | undefined {
    return state.users;
  }

  @Selector()
  static userRoles(state: StateModel): Record<string, Role[]> | undefined {
    return state.userRoles;
  }

  @Action(LoadOrganizations)
  loadOrganization(ctx: StateContext<StateModel>): Observable<any> {
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
    ctx.patchState({ organization });

    return forkJoin({
      roles: this.data.memberships.getMembershipRolesAsync(organization.id),
      users: this.data.memberships.getMembershipUsersAsync(organization.id),
    }).pipe(
      map(({ roles, users }) => {
        ctx.patchState({
          roles,
          users: users.sort((a, b) => sorter(a.name, b.name)),
        });
      }),
      tap(() => ctx.dispatch(new LoadProjects(organization.id)))
    );
  }

  @Action(LoadAllMembershipRoles)
  LoadAllMembershipRoles(ctx: StateContext<StateModel>): Observable<void> {
    const state = ctx.getState();
    const org = state.organization?.id!;

    const calls = state.users?.map((x) => this.getRolesAsync(org, x.id)) ?? [];

    return forkJoin(calls).pipe(
      map((userRoles) => {
        const roles = userRoles.reduce(
          (acc, [userId, roles]) => ({ ...acc, [userId]: roles }),
          {} as Record<string, Role[]>
        );

        ctx.patchState({ userRoles: roles });
      })
    );
  }

  private getRolesAsync(
    organization: string,
    userId: string
  ): Observable<[string, Role[]]> {
    return this.data.memberships
      .getMembershipRolesForUserAsync(organization, userId)
      .pipe(map((roles) => [userId, roles]));
  }
}
