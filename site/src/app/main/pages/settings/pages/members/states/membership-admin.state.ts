import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Invite } from '@wbs/core/models';
import { Messages } from '@wbs/core/services';
import { UserService } from '@wbs/main/services';
import { AuthState, MembershipState } from '@wbs/main/states';
import { Observable, forkJoin } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  CancelInvite,
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
export class MembershipAdminState {
  constructor(
    private readonly data: DataServiceFactory,
    private readonly messages: Messages,
    private readonly userService: UserService,
    private readonly store: Store
  ) {}

  @Selector()
  static invitations(state: StateModel): Invite[] | undefined {
    return state.invitations;
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

    return this.data.memberships.getInvitesAsync(org).pipe(
      map((invitations) => {
        this.setRoleList(invitations);

        ctx.patchState({ invitations });
      })
    );
  }

  @Action(RemoveMemberFromOrganization)
  removeMember(
    ctx: Context,
    { memberId }: RemoveMemberFromOrganization
  ): Observable<void> {
    const state = ctx.getState();

    return this.data.memberships.removeUserFromOrganizationAsync(
      this.org,
      memberId
    );
  }

  @Action(UpdateMemberRoles)
  updateMemberRoles(
    ctx: Context,
    { member, toAdd, toRemove }: UpdateMemberRoles
  ): Observable<any> | void {
    const state = ctx.getState();
    const calls: Observable<void>[] = [];

    if (toRemove.length > 0)
      calls.push(
        this.data.memberships.removeUserOrganizationalRolesAsync(
          this.org,
          member.id,
          toRemove
        )
      );

    if (toAdd.length > 0)
      calls.push(
        this.data.memberships.addUserOrganizationalRolesAsync(
          this.org,
          member.id,
          toAdd
        )
      );

    if (calls.length === 0) return;

    return forkJoin(calls).pipe(
      tap(() => this.messages.notify.success('OrgSettings.MemberRolesUpdated'))
    );
  }

  @Action(SendInvites)
  sendInvites(ctx: Context, { emails, roles }: SendInvites): Observable<void> {
    const profile = this.store.selectSnapshot(AuthState.profile)!;
    const inviter = profile.name;
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
      tap(() => this.messages.notify.success('OrgSettings.InvitesSent')),
      map((invites) => {
        const state = ctx.getState();

        this.setRoleList(invites);

        ctx.patchState({
          invitations: [...invites, ...(state.invitations ?? [])],
        });
      })
    );
  }

  @Action(CancelInvite)
  cancelInvite(ctx: Context, { inviteId }: CancelInvite): Observable<void> {
    return this.data.memberships.cancelInviteAsync(this.org, inviteId).pipe(
      tap(() => this.messages.notify.success('OrgSettings.InviteCancelled')),
      tap(() => {
        const invites = ctx.getState().invitations!;
        const index = invites.findIndex((x) => x.id === inviteId);

        if (index > -1) invites.splice(index, 1);

        ctx.patchState({
          invitations: [...invites],
        });
      })
    );
  }

  private setRoleList(invites: Invite[]): void {
    for (const invite of invites) invite.roleList = invite.roles.join(',');
  }
}
