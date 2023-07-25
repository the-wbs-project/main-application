
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
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
