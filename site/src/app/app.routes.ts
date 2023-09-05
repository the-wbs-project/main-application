import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/loading', pathMatch: 'full' },
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
