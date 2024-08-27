import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { orgResolve, userIdResolve } from '@wbs/core/services';
import { PROJECT_PAGES } from './models';
import {
  ChecklistDataService,
  ChecklistTestService,
  LibraryEntryExportService,
  ProjectBreadcrumbsService,
  ProjectImportProcessorService,
  ProjectNavigationService,
  ProjectService,
  ProjectViewService,
  TimelineService,
  closeApprovalWindowGuard,
  projectIdResolve,
  projectUrlResolve,
  projectVerifyGuard,
} from './services';
import {
  ProjectApprovalState,
  ProjectChecklistState,
  TasksState,
} from './states';
import { ProjectActivityService } from './services/project-activity.service';
import { ProjectStore } from './stores';

export const routes: Routes = [
  {
    path: ':projectId',
    canActivate: [projectVerifyGuard],
    canDeactivate: [closeApprovalWindowGuard],
    loadComponent: () =>
      import('./view-project.component').then((m) => m.ProjectViewComponent),
    resolve: {
      userId: userIdResolve,
      projectUrl: projectUrlResolve,
    },
    providers: [
      importProvidersFrom([
        DialogModule,
        NgxsModule.forFeature([
          ProjectApprovalState,
          ProjectChecklistState,
          TasksState,
        ]),
      ]),
      ChecklistDataService,
      ChecklistTestService,
      ProjectActivityService,
      ProjectBreadcrumbsService,
      ProjectImportProcessorService,
      LibraryEntryExportService,
      ProjectNavigationService,
      ProjectService,
      ProjectStore,
      ProjectViewService,
      TimelineService,
    ],
    children: [
      { path: '', redirectTo: 'about', pathMatch: 'full' },
      {
        path: 'about',
        loadComponent: () =>
          import('./pages/project-about').then((x) => x.ProjectAboutComponent),
        canDeactivate: [closeApprovalWindowGuard],
        data: {
          navSection: 'about',
          crumbs: ['about'],
        },
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./pages/project-tasks').then((x) => x.ProjectTasksComponent),
        //loadChildren: () => import('./task-view.routes').then((x) => x.routes),
        canDeactivate: [closeApprovalWindowGuard],
        data: {
          navSection: 'tasks',
          crumbs: ['tasks'],
        },
        resolve: {
          projectUrl: projectUrlResolve,
        },
      },
      {
        path: 'timeline',
        loadComponent: () =>
          import('./pages/project-timeline-page.component').then(
            (x) => x.ProjectTimelinePageComponent
          ),
        canDeactivate: [closeApprovalWindowGuard],
        data: {
          navSection: 'timeline',
          crumbs: ['timeline'],
        },
        resolve: {
          owner: orgResolve,
          projectId: projectIdResolve,
          projectUrl: projectUrlResolve,
        },
      },
      /* {
        path: 'resources',
        loadComponent: () =>
          import('./pages/project-resources-page.component').then(
            (x) => x.ProjectResourcesPageComponent
          ),
        canActivate: [projectNavGuard],
        canDeactivate: [closeApprovalWindowGuard],
        data: {
          navSection: 'resources',
          crumbs: ['resources'],
        },
        resolve: {
          owner: orgResolve,
          projectId: projectIdResolve,
          apiUrlPrefix: projectApiUrlResolve,
        },
      },
      {
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
        path: 'upload',
        loadChildren: () =>
          import('./pages/project-upload/upload.routes').then((x) => x.routes),
        canDeactivate: [closeApprovalWindowGuard],
        data: {
          view: PROJECT_PAGES.UPLOAD,
        },
      },
      /*
      {
        path: 'settings/general',
        loadComponent: () =>
          import('./pages/project-settings-general').then(
            (x) => x.ProjectSettingsGeneralComponent
          ),
        canActivate: [projectNavGuard],
        canDeactivate: [dirtyGuard],
        data: {
          navSection: 'settings',
          crumbs: ['settings', 'general'],
        },
      },
      {
        path: 'settings/disciplines',
        loadComponent: () =>
          import('./pages/project-settings-disciplines.component').then(
            (x) => x.DisciplinesComponent
          ),
        canActivate: [projectNavGuard],
        canDeactivate: [dirtyGuard],
        data: {
          navSection: 'settings',
          crumbs: ['settings', 'disciplines'],
        },
      },
      {
        path: 'settings/roles',
        loadComponent: () =>
          import('./pages/project-settings-roles').then(
            (x) => x.RolesComponent
          ),
        canActivate: [projectNavGuard],
        data: {
          navSection: 'settings',
          crumbs: ['settings', 'roles'],
        },
        resolve: {
          org: orgResolve,
          approvalEnabled: approvalEnabledResolve,
        },
      },*/
    ],
  },
];
