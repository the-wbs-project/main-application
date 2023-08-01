
import { Routes } from '@angular/router';
import { authGuardFn } from '@auth0/auth0-angular';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuardFn],
    loadComponent: () => import('./main.component').then(m => m.MainComponent),
    children: [
      {
        path: 'projects',
        loadChildren: () => import('./pages/projects/projects.routes').then(m => m.routes)
      },
      {
        path: 'settings',
        loadChildren: () => import('./pages/settings/settings.routes').then(m => m.routes)
      },
    ],
  },
];
