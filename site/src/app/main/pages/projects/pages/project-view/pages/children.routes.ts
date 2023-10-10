import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Routes } from '@angular/router';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { RecordResource } from '@wbs/core/models';
import { MembershipState } from '@wbs/main/states';
import {
  projectRedirectGuard,
  projectViewGuard,
  taskVerifyGuard,
} from '../project-view.guards';
import { PROJECT_PAGE_VIEW, TASK_PAGE_VIEW } from '../models';
import { orgResolve } from '@wbs/main/services';
import { ProjectState } from '../states';

export const resourceResolve: ResolveFn<RecordResource[]> = (
  route: ActivatedRouteSnapshot
) => {
  const org =
    route.params['org'] ??
    inject(Store).selectSnapshot(MembershipState.organization)?.name;
  const projectId =
    route.params['projectId'] ??
    inject(Store).selectSnapshot(ProjectState.current)?.id;

  return inject(DataServiceFactory).projectResources.getByProjectIdAsync(
    org,
    projectId
  );
};

export const routes: Routes = [
  {
    path: '',
    canActivate: [projectRedirectGuard],
    loadComponent: () =>
      import('./project-about-page/project-about-page.component').then(
        ({ ProjectAboutPageComponent }) => ProjectAboutPageComponent
      ),
  },
  {
    path: 'about',
    canActivate: [projectViewGuard],
    data: {
      title: 'ProjectUpload.PagesUploadProjectPlan',
      view: PROJECT_PAGE_VIEW.ABOUT,
    },
    loadComponent: () =>
      import('./project-about-page/project-about-page.component').then(
        ({ ProjectAboutPageComponent }) => ProjectAboutPageComponent
      ),
  },
  {
    path: 'phases',
    canActivate: [projectViewGuard],
    data: {
      title: 'ProjectUpload.PagesUploadProjectPlan',
      view: PROJECT_PAGE_VIEW.PHASES,
    },
    loadComponent: () =>
      import('./project-phases-page/project-phases-page.component').then(
        ({ ProjectPhasesPageComponent }) => ProjectPhasesPageComponent
      ),
    children: [
      {
        path: 'task/:taskId',
        canActivate: [taskVerifyGuard],
        data: {
          title: 'ProjectUpload.PagesUploadProjectPlan',
        },
        loadComponent: () =>
          import('./task-view/task-view.component').then(
            ({ TaskViewComponent }) => TaskViewComponent
          ),
        children: [
          {
            path: 'about',
            data: {
              //title: 'ProjectUpload.PagesUploadProjectPlan',
              view: TASK_PAGE_VIEW.ABOUT,
            },
            loadComponent: () =>
              import('./task-about/task-about.component').then(
                ({ TaskAboutComponent }) => TaskAboutComponent
              ),
          },
          {
            path: 'sub-tasks',
            data: {
              //title: 'ProjectUpload.PagesUploadProjectPlan',
              view: TASK_PAGE_VIEW.SUB_TASKS,
            },
            loadComponent: () =>
              import('./task-sub-tasks/task-sub-tasks.component').then(
                ({ TaskSubTasksComponent }) => TaskSubTasksComponent
              ),
          },
          {
            path: 'settings',
            data: {
              title: 'ProjectUpload.PagesUploadProjectPlan',
              view: TASK_PAGE_VIEW.SETTINGS,
            },
            loadChildren: () =>
              import('./task-settings-page/task-settings.routes').then(
                ({ routes }) => routes
              ),
          },
        ],
      },
    ],
  },
  {
    path: 'disciplines',
    canActivate: [projectViewGuard],
    data: {
      title: 'ProjectUpload.PagesUploadProjectPlan',
      view: PROJECT_PAGE_VIEW.DISCIPLINES,
    },
    loadComponent: () =>
      import(
        './project-disciplines-page/project-disciplines-page.component'
      ).then(
        ({ ProjectDisciplinesPageComponent }) => ProjectDisciplinesPageComponent
      ),
  },
  {
    path: 'timeline',
    canActivate: [projectViewGuard],
    data: {
      title: 'ProjectUpload.PagesUploadProjectPlan',
      view: PROJECT_PAGE_VIEW.TIMELINE,
    },
    loadComponent: () =>
      import('./project-timeline-page.component').then(
        (x) => x.ProjectTimelinePageComponent
      ),
  },
  {
    path: 'resources',
    canActivate: [projectViewGuard],
    data: {
      //title: 'ProjectUpload.PagesUploadProjectPlan',
      view: PROJECT_PAGE_VIEW.RESOURCES,
    },
    resolve: {
      owner: orgResolve,
      list: resourceResolve,
    },
    loadComponent: () =>
      import('./project-resources-page/project-resources-page.component').then(
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
    canActivate: [projectViewGuard],
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
