import { Routes } from '@angular/router';
import { orgResolve } from '@wbs/main/services';
import {
  entryIdResolve,
  entryUrlResolve,
  libraryClaimsResolve,
  taskIdResolve,
  versionIdResolve,
} from './services';

export const routes: Routes = [
  {
    path: ':taskId',
    loadComponent: () =>
      import('./view-task.component').then((m) => m.TaskViewComponent),
    resolve: {
      entryUrl: entryUrlResolve,
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
        resolve: {
          claims: libraryClaimsResolve,
          taskId: taskIdResolve,
        },
      },
      {
        path: 'sub-tasks',
        data: {},
        loadComponent: () =>
          import('./pages/task-sub-tasks').then((x) => x.SubTasksComponent),
        resolve: {
          entryUrl: entryUrlResolve,
          taskId: taskIdResolve,
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
      {
        path: 'settings/general',
        loadComponent: () =>
          import('./pages/task-settings-general').then(
            (x) => x.GeneralComponent
          ),
        canActivate: [],
        resolve: {
          taskId: taskIdResolve,
        },
      },
    ],
  },
];
