import { Routes } from '@angular/router';
import { MembershipService, MembershipSettingStore } from './services';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full',
  },
  {
    path: ':view',
    loadComponent: () =>
      import('./membership.component').then((m) => m.MembershipComponent),
    providers: [MembershipService, MembershipSettingStore],
  },
];
