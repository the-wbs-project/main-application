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
    path: 'onboard',
    loadComponent: () =>
      import('./pages/onboard/onboard.component').then(
        (x) => x.OnboardComponent
      ),
  },
  {
    path: '',
    loadChildren: () =>
      import('./pages/_layout/layout.routes').then((m) => m.routes),
  },
];
