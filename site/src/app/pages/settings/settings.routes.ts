import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'membership',
    pathMatch: 'full',
  },
  {
    path: 'membership',
    loadChildren: () =>
      import('./pages/membership/membership.routes').then((m) => m.routes),
  },
  {
    path: 'labor-rates',
    loadChildren: () =>
      import('./pages/labor-rates/labor-rates.routes').then((m) => m.routes),
  },
];
