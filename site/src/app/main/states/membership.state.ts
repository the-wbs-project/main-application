import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Member, Organization, Project } from '@wbs/core/models';
import { Messages, sorter } from '@wbs/core/services';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import {
  ChangeOrganization,
  InitiateOrganizations,
  ProjectUpdated,
  RemoveMemberFromOrganization,
  UpdateMemberRoles,
} from '../actions';
import { UserService } from '../services';

interface StateModel {
  list?: Organization[];
  loading: boolean;
  organization?: Organization;
  orgRoles?: Record<string, string[]>;
  projects?: Project[];
  roles?: string[];
  members?: Member[];
}

declare type Context = StateContext<StateModel>;

@Injectable()
@State<StateModel>({
  name: 'membership',
  defaults: {
    loading: true,
  },
})
export class MembershipState {
  constructor(
    private readonly data: DataServiceFactory,
    private readonly messages: Messages,
    private readonly store: Store,
    private readonly userService: UserService
  ) {}

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

  @Action(InitiateOrganizations)
  initiateOrganizations(
    ctx: Context,
    { orgRoles, organizations }: InitiateOrganizations
  ): Observable<any> {
    ctx.patchState({ loading: true, list: organizations, orgRoles });

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
      roles: ctx.getState().orgRoles?.[organization.name],
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
        this.data.memberships.getMembershipUsersAsync(organization.id)
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

  @Action(RemoveMemberFromOrganization)
  removeMember(
    ctx: Context,
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

  @Action(UpdateMemberRoles)
  updateMemberRoles(
    ctx: Context,
    { memberId, roles }: UpdateMemberRoles
  ): Observable<any> | void {
    const state = ctx.getState();
    const members = state.members ?? [];
    const index = members.findIndex((x) => x.id === memberId);

    if (index === -1) return;

    const orgId = state.organization!.id;
    const member = members[index];

    const toRemove = member.roles.filter((r) => !roles.includes(r));
    const toAdd = roles.filter((r) => !member.roles.includes(r));
    const calls: Observable<void>[] = [];

    if (toRemove.length > 0)
      calls.push(
        this.data.memberships.removeUserOrganizationalRolesAsync(
          memberId,
          orgId,
          toRemove
        )
      );

    if (toAdd.length > 0)
      calls.push(
        this.data.memberships.addUserOrganizationalRolesAsync(
          memberId,
          orgId,
          toAdd
        )
      );

    if (calls.length === 0) return;

    return forkJoin(calls).pipe(
      tap(() => {
        member.roles = roles;
        members[index] = member;
        ctx.patchState({ members });
      }),
      tap(() => this.messages.success('OrgSettings.MemberRolesUpdated'))
    );
    //
  }
}
