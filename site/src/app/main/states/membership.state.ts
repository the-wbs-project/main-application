import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Invite, Member, Organization, Project } from '@wbs/core/models';
import { Messages, sorter } from '@wbs/core/services';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import {
  ChangeOrganization,
  InitiateOrganizations,
  LoadInvitations,
  ProjectUpdated,
  RemoveMemberFromOrganization,
  UpdateMemberRoles,
} from '../actions';
import { UserService } from '../services';

interface StateModel {
  invitations?: Invite[];
  loadingInvites: boolean;
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
    loadingInvites: false,
  },
})
export class MembershipState {
  constructor(
    private readonly data: DataServiceFactory,
    private readonly messages: Messages,
    private readonly userService: UserService
  ) {}

  @Selector()
  static invitations(state: StateModel): Invite[] | undefined {
    return state.invitations;
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

  @Action(LoadInvitations)
  loadInvitations(ctx: Context): Observable<any> | void {
    const state = ctx.getState();

    if (state.invitations) return;

    ctx.patchState({ loadingInvites: true });

    return this.data.memberships.getInvitesAsync(state.organization!.name).pipe(
      map((invitations) =>
        ctx.patchState({
          invitations: [...(state.invitations ?? []), ...invitations],
          loadingInvites: false,
        })
      )
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
      .removeUserFromOrganizationAsync(state.organization!.name, memberId)
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

    const orgId = state.organization!.name;
    const member = members[index];

    const toRemove = member.roles.filter((r) => !roles.includes(r));
    const toAdd = roles.filter((r) => !member.roles.includes(r));
    const calls: Observable<void>[] = [];

    if (toRemove.length > 0)
      calls.push(
        this.data.memberships.removeUserOrganizationalRolesAsync(
          orgId,
          memberId,
          toRemove
        )
      );

    if (toAdd.length > 0)
      calls.push(
        this.data.memberships.addUserOrganizationalRolesAsync(
          orgId,
          memberId,
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
  }
}
