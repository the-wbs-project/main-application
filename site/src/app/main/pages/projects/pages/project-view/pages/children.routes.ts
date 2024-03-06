import { Routes } from '@angular/router';
import { orgResolve, userIdResolve } from '@wbs/main/services';
import { PROJECT_PAGES, TASK_PAGES } from '../models';
import {
  closeApprovalWindowGuard,
  projectRedirectGuard,
  setApprovalViewAsProject,
  setApprovalViewAsTask,
  taskVerifyGuard,
} from '../project-view.guards';
import {
  projectClaimsResolve,
  projectIdResolve,
  projectUrlResolve,
  taskIdResolve,
} from '../services';

export const routes: Routes = [
  {
    path: '',
    canActivate: [projectRedirectGuard],
    loadComponent: () =>
      import('./projects/about/project-about-page.component').then(
        ({ ProjectAboutPageComponent }) => ProjectAboutPageComponent
      ),
  },
  {
    path: 'about',
    canDeactivate: [closeApprovalWindowGuard],
    data: {
      title: 'ProjectUpload.PagesUploadProjectPlan',
      view: PROJECT_PAGES.ABOUT,
    },
    loadComponent: () =>
      import('./projects/about/project-about-page.component').then(
        ({ ProjectAboutPageComponent }) => ProjectAboutPageComponent
      ),
  },
  {
    path: 'tasks',
    canDeactivate: [closeApprovalWindowGuard],
    data: {
      title: 'ProjectUpload.PagesUploadProjectPlan',
    },
    loadComponent: () =>
      import('./projects/tasks/tasks.component').then(
        (x) => x.ProjectTasksComponent
      ),
    resolve: {
      claims: projectClaimsResolve,
      projectUrl: projectUrlResolve,
    },
    children: [
      {
        path: ':taskId',
        canActivate: [taskVerifyGuard, setApprovalViewAsTask],
        canDeactivate: [closeApprovalWindowGuard, setApprovalViewAsProject],
        data: {
          title: 'ProjectUpload.PagesUploadProjectPlan',
        },
        loadComponent: () =>
          import('./tasks/task-view.component').then(
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
              import('./tasks/about/task-about.component').then(
                ({ TaskAboutComponent }) => TaskAboutComponent
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
              import('./tasks/sub-tasks/task-sub-tasks.component').then(
                ({ TaskSubTasksComponent }) => TaskSubTasksComponent
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
              import('./tasks/task-resources-page.component').then(
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
              import('./tasks/settings/task-settings.routes').then(
                ({ routes }) => routes
              ),
          },
        ],
        resolve: {
          claims: projectClaimsResolve,
          userId: userIdResolve,
        },
      },
    ],
  },
  {
    path: 'timeline',
    canDeactivate: [closeApprovalWindowGuard],
    data: {
      title: 'ProjectUpload.PagesUploadProjectPlan',
      view: PROJECT_PAGES.TIMELINE,
    },
    loadComponent: () =>
      import('./project-timeline-page.component').then(
        (x) => x.ProjectTimelinePageComponent
      ),
  },
  {
    path: 'resources',
    canDeactivate: [closeApprovalWindowGuard],
    data: {
      view: PROJECT_PAGES.RESOURCES,
    },
    resolve: {
      owner: orgResolve,
      projectId: projectIdResolve,
      claims: projectClaimsResolve,
    },
    loadComponent: () =>
      import('./projects/project-resources-page.component').then(
        (x) => x.ProjectResourcesPageComponent
      ),
  },
  /*{
    path: 'discussions',
    canActivate: [projectViewGuard, ProjectDiscussionGuard],
    data: {
      title: 'ProjectUpload.PagesUploadProjectPlan',
      view: PROJECT_PAGE_VIEW.DISCUSSIONS,
    },
    loadChildren: () =>
      import('../../../discussion-forum/discussion-forum.module').then(
        (m) => m.DiscussionForumModule
      ),
  },*/
  {
    path: 'settings',
    canDeactivate: [closeApprovalWindowGuard],
    data: {
      view: PROJECT_PAGES.SETTINGS,
    },
    loadChildren: () =>
      import('./projects/settings/project-settings.routes').then(
        ({ routes }) => routes
      ),
  },
  {
    path: 'upload',
    canDeactivate: [closeApprovalWindowGuard],
    data: {
      view: PROJECT_PAGES.UPLOAD,
    },
    loadChildren: () =>
      import('./projects/upload/upload.routes').then(({ routes }) => routes),
  },
];
