import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Routes } from '@angular/router';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { RecordResource } from '@wbs/core/models';
import { Utils, orgResolve, userIdResolve } from '@wbs/main/services';
import { PROJECT_PAGES, TASK_PAGE_VIEW } from '../models';
import {
  closeApprovalWindowGuard,
  projectRedirectGuard,
  setApprovalViewAsProject,
  setApprovalViewAsTask,
  taskVerifyGuard,
} from '../project-view.guards';
import { projectClaimsResolve } from '../services';
import { ProjectState } from '../states';

export const resourceResolve: ResolveFn<RecordResource[]> = (
  route: ActivatedRouteSnapshot
) => {
  const org = Utils.getOrgName(inject(Store), route);
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
              view: TASK_PAGE_VIEW.ABOUT,
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
              //title: 'ProjectUpload.PagesUploadProjectPlan',
              view: TASK_PAGE_VIEW.SUB_TASKS,
            },
            loadComponent: () =>
              import('./tasks/sub-tasks/task-sub-tasks.component').then(
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
      list: resourceResolve,
      claims: projectClaimsResolve,
    },
    loadComponent: () =>
      import('./projects/resources/project-resources-page.component').then(
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
      title: 'ProjectUpload.PagesUploadProjectPlan',
      view: PROJECT_PAGES.SETTINGS,
    },
    loadChildren: () =>
      import('./projects/settings/project-settings.routes').then(
        ({ routes }) => routes
      ),
  },
];
