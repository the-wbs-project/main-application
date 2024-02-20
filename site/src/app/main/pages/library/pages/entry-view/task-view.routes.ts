import { Routes } from '@angular/router';
import {
  entryIdResolve,
  libraryClaimsResolve,
  taskIdResolve,
  taskVerifyGuard,
  versionIdResolve,
} from './services';
import { orgResolve } from '@wbs/main/services';

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
      {
        path: 'sub-tasks',
        data: {},
        loadComponent: () =>
          import('./pages/sub-tasks').then((x) => x.SubTasksComponent),
        resolve: {
          owner: orgResolve,
        },
      },
      {
        path: 'resources',
        loadComponent: () =>
          import('./pages/task-resources-page.component').then(
            (x) => x.ResourcesPageComponent
          ),
        canActivate: [],
        resolve: {
          owner: orgResolve,
          taskId: taskIdResolve,
          entryId: entryIdResolve,
          versionId: versionIdResolve,
          claims: libraryClaimsResolve,
        },
      },
    ],
  },
];
