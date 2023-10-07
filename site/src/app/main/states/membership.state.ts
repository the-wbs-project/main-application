import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  Action,
  NgxsOnInit,
  Selector,
  State,
  StateContext,
  Store,
} from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Member, Organization } from '@wbs/core/models';
import { Messages, sorter } from '@wbs/core/services';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import {
  ChangeOrganization,
  InitiateOrganizations,
  RefreshMembers,
  UpdateMembers,
  UpdateOrganizationClaims,
} from '../actions';
import { UserService } from '../services';
import { AuthState } from './auth.state';

interface MembershipStateModel {
  loading: boolean;
  list?: Organization[];
  organization?: Organization;
  orgRoleList?: Record<string, string[]>;
  members?: Member[];
}

declare type Context = StateContext<MembershipStateModel>;

@Injectable()
@UntilDestroy()
@State<MembershipStateModel>({
  name: 'membership',
  defaults: {
    loading: true,
  },
})
export class MembershipState implements NgxsOnInit {
  constructor(
    private readonly auth: AuthService,
    protected readonly data: DataServiceFactory,
    protected readonly messages: Messages,
    protected readonly store: Store,
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
  static members(state: MembershipStateModel): Member[] | undefined {
    return state.members;
  }

  ngxsOnInit(ctx: Context): void {
    this.auth.user$.pipe(untilDestroyed(this)).subscribe((user) => {
      if (!user) return;

      const ns = 'http://www.pm-empower.com';

      ctx.patchState({
        orgRoleList: user[ns + '/organizations-roles']!,
      });
    });
    this.store
      .select(AuthState.profile)
      .pipe(untilDestroyed(this))
      .subscribe((profile) => {
        if (!profile) return;

        const members = ctx.getState().members ?? [];

        if (members.length == 0) return;

        const member = members.find((x) => x.id === profile?.id);

        if (member) member.name = profile.name;

        ctx.patchState({ members });
      });
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
    ctx.patchState({ loading: true, organization });

    return this.getMembers(ctx, false).pipe(
      tap(() => ctx.patchState({ loading: false })),
      switchMap(() =>
        ctx.dispatch(
          new UpdateOrganizationClaims(
            organization.name,
            ctx.getState().orgRoleList?.[organization.name] ?? []
          )
        )
      )
    );
  }

  @Action(UpdateMembers)
  updateMembers(ctx: Context, { members }: UpdateMembers): void {
    this.setRoleList(members);

    ctx.patchState({ members });
  }

  @Action(RefreshMembers)
  refreshMembers(ctx: Context): Observable<void> {
    return this.getMembers(ctx, true);
  }

  private getMembers(ctx: Context, forceRefresh: boolean): Observable<void> {
    return this.data.memberships
      .getMembershipUsersAsync(ctx.getState().organization!.name, forceRefresh)
      .pipe(
        map((members) => {
          this.setRoleList(members);

          ctx.patchState({
            members: members.sort((a, b) => sorter(a.name, b.name)),
          });
          this.userService.addUsers(members);
        })
      );
  }

  private setRoleList(members: Member[]): void {
    for (const member of members) member.roleList = member.roles.join(',');
  }
}
