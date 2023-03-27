import { Injectable } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Invite, User } from '@wbs/core/models';
import { DialogService, IdService, Messages } from '@wbs/core/services';
import { AuthState } from '@wbs/core/states';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import {
  ActivateUser,
  CancelInvite,
  DeactivateUser,
  LoadInviteData,
  LoadUserData,
  ResendInvite,
  SendInvite,
  UpdateInvite,
} from '../actions';
import { UserViewModel } from '../models';

interface StateModel {
  invites?: Invite[];
  users?: User[];
  activeUsers?: UserViewModel[];
  inactiveUsers?: UserViewModel[];
}

@Injectable()
@UntilDestroy()
@State<StateModel>({
  name: 'userAdmin',
  defaults: {},
})
export class UserAdminState {
  constructor(
    private readonly data: DataServiceFactory,
    private readonly dialogService: DialogService,
    private readonly messages: Messages,
    private readonly store: Store
  ) {}

  @Selector()
  static invites(state: StateModel): Invite[] {
    return state.invites ?? [];
  }

  @Selector()
  static activeUsers(state: StateModel): UserViewModel[] | undefined {
    return state.activeUsers;
  }

  @Selector()
  static activeUserCount(state: StateModel): number {
    return state.activeUsers?.length ?? 0;
  }

  @Selector()
  static inactiveUsers(state: StateModel): UserViewModel[] | undefined {
    return state.inactiveUsers;
  }

  @Selector()
  static inactiveUserCount(state: StateModel): number {
    return state.inactiveUsers?.length ?? 0;
  }

  @Selector()
  static users(state: StateModel): User[] | undefined {
    return state.users;
  }

  @Action(LoadInviteData)
  loadInviteData(
    ctx: StateContext<StateModel>,
    action: LoadInviteData
  ): Observable<void> | void {
    const state = ctx.getState();

    if (state.invites != null && !action.force) return;

    return this.data.invites.getAllAsync().pipe(
      map((invites) => {
        ctx.patchState({
          invites: this.filterInvites(invites),
        });
      })
    );
  }

  @Action(LoadUserData)
  loadUserData(
    ctx: StateContext<StateModel>,
    action: LoadUserData
  ): Observable<void> | void {
    const state = ctx.getState();

    if (state.users != null && !action.force) return;

    return this.data.users.getAllAsync().pipe(
      map((users) => {
        ctx.patchState({
          users,
        });
      }),
      tap(() => this.setVms(ctx))
    );
  }

  @Action(SendInvite)
  sendInvite(
    ctx: StateContext<StateModel>,
    action: SendInvite
  ): Observable<void> {
    const invite: Invite = {
      id: IdService.generate(),
      type: 'Invites',
      culture: 'en-US',
      email: action.email,
      roles: action.roles,
      dateAccepted: null,
      cancelled: false,
      dateSent: null,
    };

    return this.saveInvite(ctx, invite, true, 'Settings.InviteSent');
  }

  @Action(ResendInvite)
  resendInvite(
    ctx: StateContext<StateModel>,
    action: ResendInvite
  ): Observable<void> {
    const invites = ctx.getState().invites!;
    const invite = invites.find((x) => x.id === action.inviteId)!;

    return this.saveInvite(ctx, invite, true, 'Settings.InviteResent');
  }

  @Action(UpdateInvite)
  updateInvite(
    ctx: StateContext<StateModel>,
    action: UpdateInvite
  ): Observable<void> {
    const invites = ctx.getState().invites!;
    const invite = invites.find((x) => x.id === action.inviteId)!;

    invite.roles = action.roles;

    return this.saveInvite(ctx, invite, true, 'Settings.InviteUpdated');
  }

  @Action(CancelInvite)
  cancelInvite(
    ctx: StateContext<StateModel>,
    action: ResendInvite
  ): Observable<void> {
    const invites = ctx.getState().invites!;
    const invite = invites.find((x) => x.id === action.inviteId)!;

    invite.cancelled = true;

    return this.saveInvite(ctx, invite, false, 'Settings.InviteCancelled');
  }

  @Action(ActivateUser)
  activateUser(
    ctx: StateContext<StateModel>,
    action: ActivateUser
  ): Observable<void> {
    return this.changeActivation(
      ctx,
      action.userId,
      true,
      'Settings.ActivateUserConfirm',
      'Settings.ActivateUserPost'
    );
  }

  @Action(DeactivateUser)
  deactivateUser(
    ctx: StateContext<StateModel>,
    action: DeactivateUser
  ): Observable<void> {
    return this.changeActivation(
      ctx,
      action.userId,
      false,
      'Settings.DeactivateUserConfirm',
      'Settings.DeactivateUserPost'
    );
  }

  private getOrganization(): string {
    return this.store.selectSnapshot(AuthState.organization)!;
  }

  private changeActivation(
    ctx: StateContext<StateModel>,
    userId: string,
    isActive: boolean,
    confirmMessage: string,
    postSaveMessage: string
  ): Observable<void> {
    return this.dialogService.confirm('General.Confirm', confirmMessage).pipe(
      switchMap((answer) => {
        if (!answer) return of();

        const state = ctx.getState();
        const users = state.users!;
        const user = users.find((x) => x.id === userId)!;

        user.blocked = !isActive;

        return this.data.users.postAsync(user).pipe(
          tap(() => this.messages.success(postSaveMessage)),
          tap(() =>
            ctx.patchState({
              users,
            })
          ),
          tap(() => this.setVms(ctx))
        );
      })
    );
  }

  private convertToVm(list: User[]): UserViewModel[] {
    const org = this.getOrganization();

    return list.map(
      (x) =>
        <UserViewModel>{
          id: x.id,
          email: x.email,
          name: x.name,
          isActive: !x.blocked,
          roles: x.appInfo.organizationRoles?.find(
            (x) => x.organization === org
          )?.roles,
        }
    );
  }

  private setVms(ctx: StateContext<StateModel>): void {
    const users = ctx.getState().users!;
    const vms = this.convertToVm(users);

    ctx.patchState({
      activeUsers: vms.filter((x) => x.isActive),
      inactiveUsers: vms.filter((x) => !x.isActive),
    });
  }

  private filterInvites(invites: Invite[]): Invite[] {
    return invites.filter((x) => !x.dateAccepted && !x.cancelled);
  }

  private saveInvite(
    ctx: StateContext<StateModel>,
    invite: Invite,
    send: boolean,
    message: string
  ): Observable<void> {
    return this.data.invites.putAsync(invite, send).pipe(
      tap(() => this.messages.success(message)),
      map((invite2) => {
        const invites = ctx.getState().invites!;
        const index = invites.findIndex((x) => x.id === invite.id);

        if (index === -1) {
          ctx.patchState({
            invites: this.filterInvites([invite2, ...invites]),
          });
        } else {
          invites[index] = invite2;

          ctx.patchState({
            invites: this.filterInvites(invites),
          });
        }
      })
    );
  }
}
