import { Routes } from '@angular/router';
import { dirtyGuard } from '@wbs/core/guards';
import { orgResolve } from '@wbs/main/services';
import {
  entryIdResolve,
  taskNavGuard,
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
        canActivate: [taskNavGuard],
        data: {
          section: 'about',
        },
        resolve: {
          claims: libraryClaimsResolve,
          taskId: taskIdResolve,
        },
      },
      {
        path: 'sub-tasks',
        loadComponent: () =>
          import('./pages/task-sub-tasks').then((x) => x.SubTasksComponent),
        canActivate: [taskNavGuard],
        data: {
          section: 'sub-tasks',
        },
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
        canActivate: [taskNavGuard],
        data: {
          section: 'resources',
        },
        resolve: {
          owner: orgResolve,
          taskId: taskIdResolve,
          entryId: entryIdResolve,
          versionId: versionIdResolve,
          claims: libraryClaimsResolve,
        },
      },
      {
        path: 'settings/disciplines',
        loadComponent: () =>
          import('./pages/task-settings-disciplines').then(
            (x) => x.DisciplinesComponent
          ),
        canActivate: [taskNavGuard],
        canDeactivate: [dirtyGuard],
        data: {
          section: 'settings',
        },
        resolve: {
          taskId: taskIdResolve,
        },
      },
      {
        path: 'settings/general',
        loadComponent: () =>
          import('./pages/task-settings-general').then(
            (x) => x.GeneralComponent
          ),
        canActivate: [taskNavGuard],
        data: {
          section: 'settings',
        },
        resolve: {
          taskId: taskIdResolve,
        },
      },
    ],
  },
];
