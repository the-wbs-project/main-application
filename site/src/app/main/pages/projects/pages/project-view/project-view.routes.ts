import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import {
  Transformers,
  disciplineResolver,
  orgResolve,
  userIdResolve,
} from '@wbs/main/services';
import { PROJECT_PAGES } from './models';
import {
  ChecklistDataService,
  ChecklistTestService,
  LibraryEntryExportService,
  ProjectNavigationService,
  ProjectService,
  ProjectViewService,
  TimelineService,
  closeApprovalWindowGuard,
  projectClaimsResolve,
  projectIdResolve,
  projectNavGuard,
  projectRedirectGuard,
  projectUrlResolve,
  projectVerifyGuard,
} from './services';
import {
  ProjectApprovalState,
  ProjectChecklistState,
  ProjectState,
  TasksState,
} from './states';

export const routes: Routes = [
  {
    path: ':projectId',
    canActivate: [projectVerifyGuard],
    canDeactivate: [closeApprovalWindowGuard],
    loadComponent: () =>
      import('./view-project.component').then((m) => m.ProjectViewComponent),
    resolve: {
      claims: projectClaimsResolve,
      userId: userIdResolve,
      projectUrl: projectUrlResolve,
    },
    providers: [
      importProvidersFrom(
        NgxsModule.forFeature([
          ProjectApprovalState,
          ProjectChecklistState,
          ProjectState,
          TasksState,
        ])
      ),
      ChecklistDataService,
      ChecklistTestService,
      LibraryEntryExportService,
      ProjectNavigationService,
      ProjectService,
      ProjectViewService,
      TimelineService,
      Transformers,
    ],
    children: [
      {
        path: '',
        canActivate: [projectRedirectGuard],
        loadComponent: () =>
          import('./pages/project-about').then((x) => x.ProjectAboutComponent),
      },
      {
        path: 'about',
        canActivate: [projectNavGuard],
        canDeactivate: [closeApprovalWindowGuard],
        data: {
          navSection: 'about',
          crumbs: ['about'],
          view: PROJECT_PAGES.ABOUT,
        },
        resolve: {
          claims: projectClaimsResolve,
          disciplines: disciplineResolver,
        },
        loadComponent: () =>
          import('./pages/project-about').then((x) => x.ProjectAboutComponent),
      },
      {
        path: 'tasks',
        canDeactivate: [closeApprovalWindowGuard],
        data: {
          title: 'ProjectUpload.PagesUploadProjectPlan',
        },
        loadComponent: () =>
          import('./pages/projects/tasks/tasks.component').then(
            (x) => x.ProjectTasksComponent
          ),
        resolve: {
          claims: projectClaimsResolve,
          projectUrl: projectUrlResolve,
        },
        loadChildren: () => import('./task-view.routes').then((x) => x.routes),
      },
      {
        path: 'timeline',
        canDeactivate: [closeApprovalWindowGuard],
        data: {
          title: 'ProjectUpload.PagesUploadProjectPlan',
          view: PROJECT_PAGES.TIMELINE,
        },
        loadComponent: () =>
          import('./pages/project-timeline-page.component').then(
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
          import('./pages/projects/project-resources-page.component').then(
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
          import('./pages/projects/settings/project-settings.routes').then(
            (x) => x.routes
          ),
      },
      {
        path: 'upload',
        canDeactivate: [closeApprovalWindowGuard],
        data: {
          view: PROJECT_PAGES.UPLOAD,
        },
        loadChildren: () =>
          import('./pages/projects/upload/upload.routes').then((x) => x.routes),
      },
    ],
  },
];
