import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { userIdResolve } from '@wbs/core/services';
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
} from './services';
import { ProjectChecklistState } from './states';
import { ProjectStore } from './stores';

export const routes: Routes = [
  {
    path: ':recordId',
    canDeactivate: [closeApprovalWindowGuard],
    loadComponent: () =>
      import('./project-view.component').then((m) => m.ProjectViewComponent),
    resolve: {
      userId: userIdResolve,
    },
    providers: [
      importProvidersFrom([NgxsModule.forFeature([ProjectChecklistState])]),
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
      },
      {
        path: 'timeline',
        loadComponent: () =>
          import('./pages/project-timeline.component').then(
            (x) => x.ProjectTimelinePageComponent
          ),
        canDeactivate: [closeApprovalWindowGuard],
      },
    ],
  },
];
