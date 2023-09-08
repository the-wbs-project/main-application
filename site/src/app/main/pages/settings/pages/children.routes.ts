import { Routes } from '@angular/router';
import { orgResolve } from './children.resolvers';
import { verifyInvitationsLoaded } from './children.guards';

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
    data: {
      view: 'members',
    },
    resolve: {
      org: orgResolve,
    },
  },
  {
    path: 'members/invitations',
    loadComponent: () =>
      import('./members/members.component').then((m) => m.MembersComponent),
    canActivate: [verifyInvitationsLoaded],
    data: {
      view: 'invitations',
    },
    resolve: {
      org: orgResolve,
    },
  },
];
