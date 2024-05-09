import { Routes } from '@angular/router';
import { dirtyGuard } from '@wbs/core/guards';
import { orgResolve, userIdResolve } from '@wbs/core/services';
import {
  closeApprovalWindowGuard,
  projectClaimsResolve,
  projectIdResolve,
  projectUrlResolve,
  setApprovalViewAsProject,
  setApprovalViewAsTask,
  taskIdResolve,
  taskNavGuard,
  taskVerifyGuard,
} from './services';

export const routes: Routes = [
  {
    path: ':taskId',
    canActivate: [taskVerifyGuard, setApprovalViewAsTask],
    canDeactivate: [closeApprovalWindowGuard, setApprovalViewAsProject],
    loadComponent: () =>
      import('./view-task.component').then((x) => x.TaskViewComponent),
    resolve: {
      claims: projectClaimsResolve,
      projectUrl: projectUrlResolve,
      taskId: taskIdResolve,
      userId: userIdResolve,
    },
    children: [
      { path: '', redirectTo: 'about', pathMatch: 'full' },
      {
        path: 'about',
        loadComponent: () =>
          import('./pages/task-about').then((x) => x.TaskAboutComponent),
        canActivate: [taskNavGuard],
        data: {
          navSection: 'about',
          crumbs: ['about'],
        },
        resolve: {
          claims: projectClaimsResolve,
        },
      },
      {
        path: 'sub-tasks',
        loadComponent: () =>
          import('./pages/task-sub-tasks').then((x) => x.SubTasksComponent),
        canActivate: [taskNavGuard],
        data: {
          navSection: 'sub-tasks',
          crumbs: ['sub-tasks'],
        },
        resolve: {
          projectUrl: projectUrlResolve,
        },
      },
      {
        path: 'resources',
        loadComponent: () =>
          import('./pages/task-resources-page.component').then(
            (x) => x.TaskResourcesPageComponent
          ),
        canActivate: [taskNavGuard],
        canDeactivate: [closeApprovalWindowGuard],
        data: {
          navSection: 'resources',
          crumbs: ['resources'],
        },
        resolve: {
          owner: orgResolve,
          projectId: projectIdResolve,
          taskId: taskIdResolve,
          claims: projectClaimsResolve,
        },
      },
      {
        path: 'settings',
        children: [
          { path: '', redirectTo: 'general', pathMatch: 'full' },

          {
            path: 'general',
            canActivate: [taskNavGuard],
            canDeactivate: [dirtyGuard],
            loadComponent: () =>
              import('./pages/task-settings-general').then(
                (x) => x.GeneralComponent
              ),
            data: {
              navSection: 'settings',
              crumbs: ['settings', 'general'],
            },
            resolve: {
              taskId: taskIdResolve,
            },
          },
          {
            path: 'disciplines',
            canActivate: [taskNavGuard],
            canDeactivate: [dirtyGuard],
            loadComponent: () =>
              import('./pages/task-settings-disciplines').then(
                (x) => x.DisciplinesComponent
              ),
            data: {
              navSection: 'settings',
              crumbs: ['settings', 'disciplines'],
            },
          },
        ],
      },
    ],
  },
];
