import { Routes } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { orgMemberResolve, orgResolve } from '@wbs/main/services';
import { verifyInvitationsLoaded } from './children.guards';
import { MembershipAdminState } from './members/states';

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
    canActivate: [verifyInvitationsLoaded],
    resolve: {
      org: orgResolve,
      members: orgMemberResolve,
    },
    providers: [
      importProvidersFrom(NgxsModule.forFeature([MembershipAdminState])),
    ],
  },
];
