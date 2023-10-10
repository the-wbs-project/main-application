import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Permissions, Role, RoleIds } from '@wbs/core/models';
import { Observable, forkJoin } from 'rxjs';
import { ROLE_ICONS } from 'src/environments/icons';
import { UpdateOrganizationClaims, UpdateProjectClaims } from '../actions';

enum ROLES {
  PM = 'pm',
  APPROVER = 'approver',
  SME = 'sme',
  ADMIN = 'admin',
}

interface StateModel {
  roleIds?: RoleIds;
  roleDefinitions: Role[];

  organizationId?: string;
  organizationClaims?: string[];
  organizationRoles?: string[];
  organizationPermissions?: Permissions;

  projectId?: string;
  projectClaims?: string[];
  projectRoles?: string[];
  projectPermissions?: Permissions;

  siteRoles?: string[];
}

declare type Context = StateContext<StateModel>;

@Injectable()
@UntilDestroy()
@State<StateModel>({
  name: 'permissions',
  defaults: {
    roleDefinitions: [],
  },
})
export class PermissionsState implements NgxsOnInit {
  constructor(
    private readonly auth: AuthService,
    private readonly data: DataServiceFactory
  ) {}

  @Selector()
  static roleIds(state: StateModel): RoleIds | undefined {
    return state.roleIds;
  }

  @Selector()
  static roleDefinitions(state: StateModel): Role[] {
    return state.roleDefinitions ?? [];
  }

  @Selector()
  static organizationId(state: StateModel): string | undefined {
    return state.organizationId;
  }

  @Selector()
  static organizationRoles(state: StateModel): string[] | undefined {
    return state.organizationRoles;
  }

  @Selector()
  static projectId(state: StateModel): string | undefined {
    return state.projectId;
  }

  @Selector()
  static claims(state: StateModel): string[] {
    return [
      ...(state.organizationClaims ?? []),
      ...(state.projectClaims ?? []),
    ];
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
        roleIds: {
          admin: admin.id,
          pm: pm.id,
          approver: approver.id,
          sme: sme.id,
        },
        roleDefinitions: [pm, approver, sme, admin],
      });
      forkJoin({
        organization: this.data.permissions.getAsync('organization'),
        projects: this.data.permissions.getAsync('projects'),
      }).subscribe(({ organization, projects }) => {
        for (const key of Object.keys(projects)) {
          projects[key] = this.convertRoles(ctx, projects[key]);
        }
        for (const key of Object.keys(organization!)) {
          organization![key] = this.convertRoles(ctx, organization![key]);
        }

        ctx.patchState({
          projectPermissions: projects,
          organizationPermissions: organization!,
        });
      });
    });
  }

  @Action(UpdateOrganizationClaims)
  updateOrganizationClaims(
    ctx: Context,
    { id, roles }: UpdateOrganizationClaims
  ): Observable<void> | void {
    console.log('Org Roles', id, roles);

    const state = ctx.getState();
    const claims = this.getClaims(state.organizationPermissions, roles);

    ctx.patchState({
      organizationId: id,
      organizationRoles: roles,
      organizationClaims: claims,
    });

    if (state.projectId)
      return ctx.dispatch(
        new UpdateProjectClaims(state.projectId, state.projectRoles!)
      );
  }

  @Action(UpdateProjectClaims)
  updateProjectClaims(ctx: Context, { id, roles }: UpdateProjectClaims): void {
    console.log('Project Roles', id, roles);

    ctx.patchState({
      projectId: id,
      projectRoles: roles,
    });

    const state = ctx.getState();

    if (!state.organizationRoles) return;

    const actualRoles: string[] = [];
    const adminId = state.roleIds!.admin;

    if (state.organizationRoles.includes(adminId)) actualRoles.push(adminId);

    for (const role of roles) {
      if (state.organizationRoles.includes(role)) actualRoles.push(role);
    }
    ctx.patchState({
      projectClaims: this.getClaims(state.projectPermissions, actualRoles),
    });
  }

  private convertRoles(ctx: Context, roles: string[]): string[] {
    const definitions = ctx.getState().roleDefinitions;

    return roles.map((role) => definitions.find((rd) => rd.name === role)!.id);
  }

  private getClaims(permissions: Permissions | undefined, roles: string[]) {
    const results: string[] = [];

    if (permissions)
      for (const key of Object.keys(permissions)) {
        const claimRoles = permissions[key];

        if (claimRoles.some((r) => roles.includes(r))) results.push(key);
      }
    return results;
  }
}
