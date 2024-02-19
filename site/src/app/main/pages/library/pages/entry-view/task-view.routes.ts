import { Routes } from '@angular/router';
import {
  libraryClaimsResolve,
  redirectTaskGuard,
  taskVerifyGuard,
} from './services';

export const routes: Routes = [
  {
    path: ':taskId',
    canActivate: [taskVerifyGuard],
    loadComponent: () =>
      import('./view-task.component').then((m) => m.TaskViewComponent),
    resolve: {
      claims: libraryClaimsResolve,
    },
    children: [
      {
        path: '',
        redirectTo: 'about',
        pathMatch: 'full',
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./pages/task-about').then((x) => x.TaskAboutPageComponent),
      },
    ],
  },
];
