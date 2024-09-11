import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { orgResolve, userIdResolve } from '@wbs/core/services';
import { ProjectActivityService } from '../../services';
import {
  ChecklistDataService,
  ChecklistTestService,
  LibraryEntryExportService,
  ProjectActionButtonService,
  ProjectImportService,
  ProjectService,
  ProjectTaskResourceService,
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
      LibraryEntryExportService,
      ProjectActionButtonService,
      ProjectActivityService,
      ProjectImportService,
      ProjectService,
      ProjectStore,
      ProjectTaskResourceService,
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
    ],
  },
];
