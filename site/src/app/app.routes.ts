import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login.component').then((x) => x.LoginComponent),
  },
  {
    path: 'logout',
    loadComponent: () =>
      import('./logout.component').then((x) => x.LogoutComponent),
  },
  {
    path: '',
    loadChildren: () => import('./main/main.routes').then((x) => x.routes),
  },
];
