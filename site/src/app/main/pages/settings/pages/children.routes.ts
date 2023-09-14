import { Routes } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { refreshMembers, verifyInvitationsLoaded } from './children.guards';
import { orgResolve } from './children.resolvers';
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
    canActivate: [verifyInvitationsLoaded, refreshMembers],
    resolve: {
      org: orgResolve,
    },
    providers: [
      importProvidersFrom(NgxsModule.forFeature([MembershipAdminState])),
    ],
  },
];
