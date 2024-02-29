import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { Transformers, userIdResolve } from '@wbs/main/services';
import {
  closeApprovalWindowGuard,
  projectVerifyGuard,
} from './project-view.guards';
import {
  ChecklistDataService,
  ChecklistTestService,
  LibraryEntryExportService,
  ProjectNavigationService,
  ProjectViewService,
  TimelineService,
  projectClaimsResolve,
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
      import('./project-view-layout.component').then(
        (m) => m.ProjectViewLayoutComponent
      ),
    loadChildren: () => import('./pages/children.routes').then((m) => m.routes),
    providers: [
      importProvidersFrom(
        DialogModule,
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
      ProjectViewService,
      TimelineService,
      Transformers,
    ],
    resolve: {
      claims: projectClaimsResolve,
      userId: userIdResolve,
    },
  },
];
