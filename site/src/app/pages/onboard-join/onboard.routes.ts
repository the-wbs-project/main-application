import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: ':organizationId/:inviteId',
    loadComponent: () =>
      import('./onboard-join.component').then((x) => x.OnboardJoinComponent),
  },
];
