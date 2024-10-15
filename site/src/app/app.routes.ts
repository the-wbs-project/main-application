import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login.component').then((x) => x.LoginComponent),
  },
  {
    path: 'logout',
    loadComponent: () =>
      import('./pages/logout.component').then((x) => x.LogoutComponent),
  },
  {
    path: 'callback',
    loadComponent: () =>
      import('./pages/callback.component').then((x) => x.CallbackComponent),
  },
  {
    path: 'onboard',
    loadChildren: () =>
      import('./pages/onboard/onboard.routes').then((m) => m.routes),
  },
  {
    path: '',
    loadChildren: () =>
      import('./pages/_layout/layout.routes').then((m) => m.routes),
  },
];
