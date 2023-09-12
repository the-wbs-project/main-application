import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NgxsOnInit, Selector, State, StateContext, Store } from '@ngxs/store';
import { Role, RoleIds } from '@wbs/core/models';
import { Resources } from '@wbs/core/services';
import { ROLE_ICONS } from 'src/environments/icons';
import { MembershipState } from './membership.state';

enum ROLES {
  PM = 'pm',
  APPROVER = 'approver',
  SME = 'sme',
  ADMIN = 'admin',
}

interface StateModel {
  definitions: Role[];
  siteRoles?: string[];
  orgRoleList?: Record<string, string[]>;
  orgRoles?: string[];
  ids?: RoleIds;
}

declare type Context = StateContext<StateModel>;

@Injectable()
@UntilDestroy()
@State<StateModel>({
  name: 'roles',
  defaults: {
    definitions: [],
  },
})
export class RolesState implements NgxsOnInit {
  constructor(
    private readonly auth: AuthService,
    private readonly store: Store
  ) {}

  @Selector()
  static definitions(state: StateModel): Role[] {
    return state.definitions ?? [];
  }

  @Selector()
  static ids(state: StateModel): RoleIds {
    return state.ids!;
  }

  @Selector()
  static isSiteAdmin(state: StateModel): boolean {
    return (state.siteRoles ?? []).includes(state.ids!.admin);
  }

  @Selector()
  static isAdmin(state: StateModel): boolean {
    return (state.orgRoles ?? []).includes(state.ids!.admin);
  }

  @Selector()
  static isApprover(state: StateModel): boolean {
    return (state.orgRoles ?? []).includes(state.ids!.approver);
  }

  @Selector()
  static isPm(state: StateModel): boolean {
    return (state.orgRoles ?? []).includes(state.ids!.pm);
  }

  @Selector()
  static isSme(state: StateModel): boolean {
    return (state.orgRoles ?? []).includes(state.ids!.sme);
  }

  @Selector()
  static orgRoles(state: StateModel): string[] | undefined {
    return state.orgRoles;
  }

  ngxsOnInit(ctx: Context): void {
    this.auth.user$.pipe(untilDestroyed(this)).subscribe((user) => {
      if (!user) return;

      const ns = 'http://www.pm-empower.com';
      const definitions: Role[] = user[ns + '/roles']!;

      const pm = definitions.find((x) => x.name === ROLES.PM)!;
      const approver = definitions.find((x) => x.name === ROLES.APPROVER)!;
      const sme = definitions.find((x) => x.name === ROLES.SME)!;
      const admin = definitions.find((x) => x.name === ROLES.ADMIN)!;

      admin.description = 'General.Admin-Full';
      admin.abbreviation = 'General.Admin';

      approver.description = 'General.Approver';
      approver.abbreviation = 'General.Approver';
      approver.icon = ROLE_ICONS.approver;

      pm.description = 'General.PM-Full';
      pm.abbreviation = 'General.PM';
      pm.icon = ROLE_ICONS.pm;

      sme.description = 'General.SME-Full';
      sme.abbreviation = 'General.SME';
      sme.icon = ROLE_ICONS.sme;

      ctx.patchState({
        siteRoles: user[ns + '/site-roles'] ?? [],
        orgRoleList: user[ns + '/organizations-roles']!,
        ids: {
          admin: admin.id,
          pm: pm.id,
          approver: approver.id,
          sme: sme.id,
        },
        definitions: [pm, approver, sme, admin],
      });
    });
    this.store
      .select(MembershipState.organization)
      .pipe(untilDestroyed(this))
      .subscribe((org) =>
        ctx.patchState({ orgRoles: ctx.getState().orgRoleList?.[org!.name] })
      );
  }
}
