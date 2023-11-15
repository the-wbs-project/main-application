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
import { Organization } from '@wbs/core/models';
import { Messages } from '@wbs/core/services';
import { Observable } from 'rxjs';
import { ChangeOrganization, InitiateOrganizations } from '../actions';
import { UserService } from '../services';

interface StateModel {
  loading: boolean;
  list?: Organization[];
  organization?: Organization;
  orgRoleList?: Record<string, string[]>;
  roles?: string[];
}

declare type Context = StateContext<StateModel>;

@Injectable()
@UntilDestroy()
@State<StateModel>({
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
  static roles(state: StateModel): string[] | undefined {
    return state.roles;
  }

  ngxsOnInit(ctx: Context): void {
    this.auth.user$.pipe(untilDestroyed(this)).subscribe((user) => {
      if (!user) return;

      const ns = 'http://www.pm-empower.com';

      ctx.patchState({
        orgRoleList: user[ns + '/organizations-roles']!,
      });
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
  changeOrganization(ctx: Context, { organization }: ChangeOrganization): void {
    ctx.patchState({ loading: true, organization });
  }
}
