import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import {
  CategorySelectionService,
  Transformers,
  WbsNodeService,
  disciplineResolver,
  orgResolve,
  projectCategoryResolver,
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
  approvalEnabledResolve,
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
import { dirtyGuard } from '@wbs/main/guards';

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
      CategorySelectionService,
      ChecklistDataService,
      ChecklistTestService,
      LibraryEntryExportService,
      ProjectNavigationService,
      ProjectService,
      ProjectViewService,
      TimelineService,
      Transformers,
      WbsNodeService,
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
        loadComponent: () =>
          import('./pages/project-about').then((x) => x.ProjectAboutComponent),
        canActivate: [projectNavGuard],
        canDeactivate: [closeApprovalWindowGuard],
        data: {
          navSection: 'about',
          crumbs: ['about'],
        },
        resolve: {
          claims: projectClaimsResolve,
          disciplines: disciplineResolver,
        },
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./pages/project-tasks').then((x) => x.ProjectTasksComponent),
        loadChildren: () => import('./task-view.routes').then((x) => x.routes),
        canActivate: [projectNavGuard],
        canDeactivate: [closeApprovalWindowGuard],
        data: {
          navSection: 'tasks',
          crumbs: ['tasks'],
        },
        resolve: {
          claims: projectClaimsResolve,
          projectUrl: projectUrlResolve,
        },
      },
      {
        path: 'timeline',
        loadComponent: () =>
          import('./pages/project-timeline-page.component').then(
            (x) => x.ProjectTimelinePageComponent
          ),
        canActivate: [projectNavGuard],
        canDeactivate: [closeApprovalWindowGuard],
        data: {
          navSection: 'timeline',
          crumbs: ['timeline'],
        },
        resolve: {
          projectId: projectIdResolve,
          projectUrl: projectUrlResolve,
        },
      },
      {
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
          claims: projectClaimsResolve,
        },
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
        path: 'upload',
        loadChildren: () =>
          import('./pages/projects/upload/upload.routes').then((x) => x.routes),
        canActivate: [projectNavGuard],
        canDeactivate: [closeApprovalWindowGuard],
        data: {
          view: PROJECT_PAGES.UPLOAD,
        },
      },
      {
        path: 'settings/general',
        loadComponent: () =>
          import('./pages/project-settings-general').then(
            (x) => x.ProjectSettingsGeneralComponent
          ),
        canActivate: [projectNavGuard],
        canDeactivate: [dirtyGuard],
        resolve: {
          categories: projectCategoryResolver,
        },
      },
      {
        path: 'settings/phases',
        loadComponent: () =>
          import('./pages/projects/settings/pages/phases.component').then(
            (x) => x.ProjectSettingsPhasesComponent
          ),
        canActivate: [projectNavGuard],
        canDeactivate: [dirtyGuard],
      },
      {
        path: 'settings/disciplines',
        loadComponent: () =>
          import('./pages/project-settings-disciplines').then(
            (x) => x.DisciplinesComponent
          ),
        canActivate: [projectNavGuard],
        canDeactivate: [dirtyGuard],
        resolve: {
          cats: disciplineResolver,
        },
      },
      {
        path: 'settings/roles',
        loadComponent: () =>
          import('./pages/project-settings-roles').then(
            (x) => x.RolesComponent
          ),
        canActivate: [projectNavGuard],
        resolve: {
          org: orgResolve,
          approvalEnabled: approvalEnabledResolve,
        },
      },
    ],
  },
];
