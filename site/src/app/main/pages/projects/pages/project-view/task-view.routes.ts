import { Routes } from '@angular/router';
import { orgResolve, userIdResolve } from '@wbs/main/services';
import {
  closeApprovalWindowGuard,
  projectClaimsResolve,
  projectIdResolve,
  setApprovalViewAsProject,
  setApprovalViewAsTask,
  taskIdResolve,
  taskVerifyGuard,
} from './services';
import { TASK_PAGES } from './models';

export const routes: Routes = [
  {
    path: ':taskId',
    canActivate: [taskVerifyGuard, setApprovalViewAsTask],
    canDeactivate: [closeApprovalWindowGuard, setApprovalViewAsProject],
    data: {
      title: 'ProjectUpload.PagesUploadProjectPlan',
    },
    loadComponent: () =>
      import('./pages/tasks/task-view.component').then(
        ({ TaskViewComponent }) => TaskViewComponent
      ),
    children: [
      {
        path: 'about',
        data: {
          //title: 'ProjectUpload.PagesUploadProjectPlan',
          view: TASK_PAGES.ABOUT,
        },
        loadComponent: () =>
          import('./pages/tasks/about/task-about.component').then(
            (x) => x.TaskAboutComponent
          ),
        resolve: {
          claims: projectClaimsResolve,
        },
      },
      {
        path: 'sub-tasks',
        data: {
          view: TASK_PAGES.SUB_TASKS,
        },
        loadComponent: () =>
          import('./pages/tasks/sub-tasks/task-sub-tasks.component').then(
            (x) => x.TaskSubTasksComponent
          ),
      },
      {
        path: 'resources',
        canDeactivate: [closeApprovalWindowGuard],
        data: {
          view: TASK_PAGES.RESOURCES,
        },
        resolve: {
          owner: orgResolve,
          projectId: projectIdResolve,
          taskId: taskIdResolve,
          claims: projectClaimsResolve,
        },
        loadComponent: () =>
          import('./pages/tasks/task-resources-page.component').then(
            (x) => x.TaskResourcesPageComponent
          ),
      },
      {
        path: 'settings',
        data: {
          title: 'ProjectUpload.PagesUploadProjectPlan',
          view: TASK_PAGES.SETTINGS,
        },
        loadChildren: () =>
          import('./pages/tasks/settings/task-settings.routes').then(
            (x) => x.routes
          ),
      },
    ],
    resolve: {
      claims: projectClaimsResolve,
      userId: userIdResolve,
    },
  },
];
