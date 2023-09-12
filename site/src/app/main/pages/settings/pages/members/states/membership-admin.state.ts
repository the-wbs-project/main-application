import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Invite, Member } from '@wbs/core/models';
import { Messages } from '@wbs/core/services';
import { UpdateMembers } from '@wbs/main/actions';
import { UserService } from '@wbs/main/services';
import { AuthState, MembershipState } from '@wbs/main/states';
import { Observable, forkJoin } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  LoadInvitations,
  RemoveMemberFromOrganization,
  SendInvites,
  UpdateMemberRoles,
} from '../actions';

interface StateModel {
  invitations?: Invite[];
}

declare type Context = StateContext<StateModel>;

@State<StateModel>({
  name: 'membershipAdmin',
})
@Injectable()
export class MembershipAdminState extends MembershipState {
  constructor(
    data: DataServiceFactory,
    messages: Messages,
    userService: UserService,
    private readonly store: Store
  ) {
    super(data, messages, userService);
  }

  @Selector()
  static invitations(state: StateModel): Invite[] | undefined {
    return state.invitations;
  }

  private get members(): Member[] {
    return this.store.selectSnapshot(MembershipState.members)!;
  }

  private get org(): string {
    return this.store.selectSnapshot(MembershipState.organization)!.name;
  }

  @Action(LoadInvitations)
  loadInvitations(
    ctx: Context,
    { org }: LoadInvitations
  ): Observable<any> | void {
    const state = ctx.getState();

    if (state.invitations) return;

    return this.data.memberships
      .getInvitesAsync(org)
      .pipe(map((invitations) => ctx.patchState({ invitations })));
  }

  @Action(RemoveMemberFromOrganization)
  removeMember(
    ctx: Context,
    { memberId }: RemoveMemberFromOrganization
  ): Observable<void> {
    const state = ctx.getState();

    return this.data.memberships
      .removeUserFromOrganizationAsync(this.org, memberId)
      .pipe(
        tap(() => {
          const members = [...(this.members ?? [])];
          const index = members.findIndex((x) => x.id === memberId);

          if (index > -1) members.splice(index, 1);

          return ctx.dispatch(new UpdateMembers(members));
        })
      );
  }

  @Action(UpdateMemberRoles)
  updateMemberRoles(
    ctx: Context,
    { memberId, roles }: UpdateMemberRoles
  ): Observable<any> | void {
    const state = ctx.getState();
    const members = [...(this.members ?? [])];
    const index = members.findIndex((x) => x.id === memberId);

    if (index === -1) return;

    const member = members[index];

    const toRemove = member.roles.filter((r) => !roles.includes(r));
    const toAdd = roles.filter((r) => !member.roles.includes(r));
    const calls: Observable<void>[] = [];

    if (toRemove.length > 0)
      calls.push(
        this.data.memberships.removeUserOrganizationalRolesAsync(
          this.org,
          memberId,
          toRemove
        )
      );

    if (toAdd.length > 0)
      calls.push(
        this.data.memberships.addUserOrganizationalRolesAsync(
          this.org,
          memberId,
          toAdd
        )
      );

    if (calls.length === 0) return;

    return forkJoin(calls).pipe(
      tap(() => {
        member.roles = roles;
        members[index] = member;

        return ctx.dispatch(new UpdateMembers(members));
      }),
      tap(() => this.messages.success('OrgSettings.MemberRolesUpdated'))
    );
  }

  @Action(SendInvites)
  sendInvites(ctx: Context, { emails, roles }: SendInvites): Observable<void> {
    const inviter = this.store.selectSnapshot(AuthState.profile)!.name;
    const saves: Observable<Invite>[] = [];

    for (const invitee of emails) {
      saves.push(
        this.data.memberships.sendInvitesAsync(this.org, {
          invitee,
          inviter,
          roles,
        })
      );
    }
    return forkJoin(saves).pipe(
      tap(() => this.messages.success('OrgSettings.InvitesSent')),
      map((invites) => {
        const state = ctx.getState();

        ctx.patchState({
          invitations: [...invites, ...(state.invitations ?? [])],
        });
      })
    );
  }
}
