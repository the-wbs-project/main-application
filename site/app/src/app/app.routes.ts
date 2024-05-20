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
    path: '',
    loadChildren: () => import('./layout/layout.routes').then((m) => m.routes),
  },
];
