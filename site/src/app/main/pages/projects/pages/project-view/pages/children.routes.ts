import { Routes } from '@angular/router';
import {
  ProjectRedirectGuard,
  ProjectViewGuard,
  TaskVerifyGuard,
  TaskViewGuard,
} from '../guards';
import { PROJECT_PAGE_VIEW, TASK_PAGE_VIEW } from '../models';

export const routes: Routes = [
  {
    path: '',
    canActivate: [ProjectRedirectGuard],
    loadComponent: () =>
      import('./project-about-page/project-about-page.component').then(({ ProjectAboutPageComponent }) => ProjectAboutPageComponent),
  },
  {
    path: 'about',
    canActivate: [ProjectViewGuard],
    data: {
      title: 'ProjectUpload.PagesUploadProjectPlan',
      view: PROJECT_PAGE_VIEW.ABOUT,
    },
    loadComponent: () =>
      import('./project-about-page/project-about-page.component').then(({ ProjectAboutPageComponent }) => ProjectAboutPageComponent),
  },
  {
    path: 'phases',
    canActivate: [ProjectViewGuard],
    data: {
      title: 'ProjectUpload.PagesUploadProjectPlan',
      view: PROJECT_PAGE_VIEW.PHASES,
    },
    loadComponent: () =>
      import('./project-phases-page/project-phases-page.component').then(({ ProjectPhasesPageComponent }) => ProjectPhasesPageComponent),
    children: [
      {
        path: 'task/:taskId',
        canActivate: [TaskVerifyGuard],
        data: {
          title: 'ProjectUpload.PagesUploadProjectPlan',
        },
        loadComponent: () =>
          import('./task-view/task-view.component').then(({ TaskViewComponent }) => TaskViewComponent),
        children: [
          {
            path: 'about',
            canActivate: [TaskViewGuard],
            data: {
              title: 'ProjectUpload.PagesUploadProjectPlan',
              view: TASK_PAGE_VIEW.ABOUT,
            },
            loadComponent: () =>
              import('./task-about/task-about.component').then(({ TaskAboutComponent }) => TaskAboutComponent),
          },
          {
            path: 'sub-tasks',
            canActivate: [TaskViewGuard],
            data: {
              title: 'ProjectUpload.PagesUploadProjectPlan',
              view: TASK_PAGE_VIEW.SUB_TASKS,
            },
            loadComponent: () =>
              import('./task-sub-tasks/task-sub-tasks.component').then(({ TaskSubTasksComponent }) => TaskSubTasksComponent),
          },
          {
            path: 'settings',
            canActivate: [TaskViewGuard],
            data: {
              title: 'ProjectUpload.PagesUploadProjectPlan',
              view: TASK_PAGE_VIEW.SETTINGS,
            },
            loadChildren: () =>
              import(
                './task-settings-page/task-settings.routes'
              ).then(({ routes }) => routes),
          },
        ],
      },
    ],
  },
  {
    path: 'disciplines',
    canActivate: [ProjectViewGuard],
    data: {
      title: 'ProjectUpload.PagesUploadProjectPlan',
      view: PROJECT_PAGE_VIEW.DISCIPLINES,
    },
    loadComponent: () =>
      import('./project-disciplines-page/project-disciplines-page.component').then(({ ProjectDisciplinesPageComponent }) => ProjectDisciplinesPageComponent),
  },
  {
    path: 'timeline',
    canActivate: [ProjectViewGuard],
    data: {
      title: 'ProjectUpload.PagesUploadProjectPlan',
      view: PROJECT_PAGE_VIEW.TIMELINE,
    },
    loadComponent: () =>
    import('./project-timeline-page.component').then(({ ProjectTimelinePageComponent }) => ProjectTimelinePageComponent),
  },
  /*{
    path: 'discussions',
    canActivate: [ProjectViewGuard, ProjectDiscussionGuard],
    data: {
      title: 'ProjectUpload.PagesUploadProjectPlan',
      view: PROJECT_PAGE_VIEW.DISCUSSIONS,
    },
    loadChildren: () =>
      import('../../../discussion-forum/discussion-forum.module').then(
        (m) => m.DiscussionForumModule
      ),
  },
  {
    path: 'task/:taskId/:view',
    component: TaskViewComponent,
    canActivate: [TaskVerifyGuard, TaskViewGuard],
    data: {
      title: 'ProjectUpload.PagesUploadProjectPlan',
      view: PROJECT_PAGE_VIEW.TIMELINE,
    },
    loadComponent: () =>
      import('./task-sub-tasks/task-sub-tasks.component').then(({ TaskSubTasksComponent }) => TaskSubTasksComponent),
  },*/
  {
    path: 'settings',
    canActivate: [ProjectViewGuard],
    data: {
      title: 'ProjectUpload.PagesUploadProjectPlan',
      view: PROJECT_PAGE_VIEW.SETTINGS,
    },
    loadChildren: () =>
      import('./project-settings-page/project-settings.routes').then(
        ({ routes }) => routes
      ),
  },
];
