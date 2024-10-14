import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: ':inviteId',
    loadComponent: () =>
      import('./onboard.component').then((x) => x.OnboardComponent),
  },
];
