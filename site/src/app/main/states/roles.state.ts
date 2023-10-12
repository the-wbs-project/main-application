import { Injectable } from '@angular/core';
import { NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Role, RoleIds } from '@wbs/core/models';
import { ROLE_ICONS } from 'src/environments/icons';

enum ROLES {
  PM = 'pm',
  APPROVER = 'approver',
  SME = 'sme',
  ADMIN = 'admin',
}

interface StateModel {
  ids?: RoleIds;
  definitions: Role[];
}

declare type Context = StateContext<StateModel>;

@Injectable()
@State<StateModel>({
  name: 'roles',
  defaults: {
    definitions: [],
  },
})
export class RoleState implements NgxsOnInit {
  constructor(private readonly data: DataServiceFactory) {}

  @Selector()
  static ids(state: StateModel): RoleIds | undefined {
    return state.ids;
  }

  @Selector()
  static definitions(state: StateModel): Role[] {
    return state.definitions ?? [];
  }

  ngxsOnInit(ctx: Context): void {
    this.data.metdata.getRolesAsync().subscribe((definitions) => {
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
        ids: {
          admin: admin.id,
          pm: pm.id,
          approver: approver.id,
          sme: sme.id,
        },
        definitions: [pm, approver, sme, admin],
      });
    });
  }
}
