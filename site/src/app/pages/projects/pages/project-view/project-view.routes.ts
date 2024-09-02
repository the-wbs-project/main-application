import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { orgResolve, userIdResolve } from '@wbs/core/services';
import { ProjectActivityService } from '../../services';
import { PROJECT_PAGES } from './models';
import {
  ChecklistDataService,
  ChecklistTestService,
  LibraryEntryExportService,
  ProjectActionButtonService,
  ProjectImportProcessorService,
  ProjectService,
  ProjectTaskService,
  ProjectViewService,
  TimelineService,
  closeApprovalWindowGuard,
  projectUrlResolve,
  projectVerifyGuard,
} from './services';
import { ProjectChecklistState } from './states';
import { ProjectStore } from './stores';

export const routes: Routes = [
  {
    path: ':recordId',
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
        NgxsModule.forFeature([ProjectChecklistState]),
      ]),
      ChecklistDataService,
      ChecklistTestService,
      ProjectActionButtonService,
      ProjectActivityService,
      ProjectImportProcessorService,
      LibraryEntryExportService,
      ProjectService,
      ProjectStore,
      ProjectTaskService,
      ProjectViewService,
      TimelineService,
    ],
    children: [
      { path: '', redirectTo: 'about', pathMatch: 'full' },
      {
        path: 'about',
        canDeactivate: [closeApprovalWindowGuard],
        loadComponent: () =>
          import('./pages/project-about').then((x) => x.ProjectAboutComponent),
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./pages/project-tasks').then((x) => x.ProjectTasksComponent),
        //loadChildren: () => import('./task-view.routes').then((x) => x.routes),
        canDeactivate: [closeApprovalWindowGuard],
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
        resolve: {
          owner: orgResolve,
          projectUrl: projectUrlResolve,
        },
      },
      {
        path: 'upload',
        loadChildren: () =>
          import('./pages/project-upload/upload.routes').then((x) => x.routes),
        canDeactivate: [closeApprovalWindowGuard],
        data: {
          view: PROJECT_PAGES.UPLOAD,
        },
      },
    ],
  },
];
