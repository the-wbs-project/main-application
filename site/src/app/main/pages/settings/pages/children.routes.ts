import { Routes } from '@angular/router';
import { inviteAdminGuard, userAdminGuard } from '../guards';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./getting-started/getting-started.component').then(m => m.GettingStartedComponent)
  },
  {
    path: 'general',
    loadComponent: () => import('./general/general.component').then(m => m.GeneralComponent)
  },
  {
    path: 'users/:view',
    canActivate: [userAdminGuard],
    loadComponent: () => import('./users/users.component').then(m => m.UsersComponent)
  },
  {
    path: 'invites',
    canActivate: [inviteAdminGuard, userAdminGuard],
    loadComponent: () => import('./invites/invites.component').then(m => m.InvitesComponent)
  },
  {
    path: 'invites/:id',
    canActivate: [inviteAdminGuard, userAdminGuard],
    loadComponent: () => import('./invites-form/invites-form.component').then(m => m.InvitesFormComponent)
  },
];
