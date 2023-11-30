import { Routes } from '@angular/router';
import { orgResolve } from '@wbs/main/services';
import {
  MembershipAdminService,
  MembershipAdminUiService,
} from './members/services';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./getting-started/getting-started.component').then(
        (m) => m.GettingStartedComponent
      ),
    resolve: {
      org: orgResolve,
    },
  },
  {
    path: 'general',
    loadComponent: () =>
      import('./general/general.component').then((m) => m.GeneralComponent),
    resolve: {
      org: orgResolve,
    },
  },
  {
    path: 'members',
    loadComponent: () =>
      import('./members/members.component').then((m) => m.MembersComponent),
    resolve: {
      org: orgResolve,
    },
    providers: [MembershipAdminService, MembershipAdminUiService],
  },
];
