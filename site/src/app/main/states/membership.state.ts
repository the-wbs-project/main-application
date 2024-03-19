import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { Organization } from '@wbs/core/models';
import { ChangeOrganization, InitiateOrganizations } from '../actions';

interface StateModel {
  loading: boolean;
  organization?: Organization;
  organizations?: Organization[];
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
  constructor(private readonly auth: AuthService) {
    
  }

  @Selector()
  static organization(state: StateModel): Organization | undefined {
    return state.organization;
  }

  @Selector()
  static organizations(state: StateModel): Organization[] | undefined {
    return state.organizations;
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
  ): void {
    for (const org of organizations)
      if (org.metadata == undefined) org.metadata = {};
      else if (typeof org.metadata.projectApprovalRequired === 'string') {
        org.metadata.projectApprovalRequired =
          org.metadata.projectApprovalRequired === 'true';
      }

    ctx.patchState({ organizations });
  }

  @Action(ChangeOrganization)
  changeOrganization(ctx: Context, { organization }: ChangeOrganization): void {
    ctx.patchState({
      organization,
      roles: ctx.getState().orgRoleList![organization.name],
    });
  }
}
