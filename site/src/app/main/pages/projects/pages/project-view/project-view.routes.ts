import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { TaskCreateService } from '@wbs/main/components/task-create';
import { TaskDeleteService } from '@wbs/main/components/task-delete';
import { DialogService, Transformers, userIdResolve } from '@wbs/main/services';
import {
  closeApprovalWindowGuard,
  projectVerifyGuard,
} from './project-view.guards';
import {
  ChecklistDataService,
  ProjectNavigationService,
  ProjectViewService,
  TimelineService,
  projectClaimsResolve,
} from './services';
import {
  ProjectApprovalState,
  ProjectChecklistState,
  ProjectState,
  ProjectViewState,
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
        NgxsModule.forFeature([
          ProjectApprovalState,
          ProjectChecklistState,
          ProjectViewState,
          ProjectState,
          TasksState,
        ])
      ),
      ChecklistDataService,
      DialogService,
      ProjectNavigationService,
      ProjectViewService,
      TaskCreateService,
      TaskDeleteService,
      TimelineService,
      Transformers,
    ],
    resolve: {
      claims: projectClaimsResolve,
      userId: userIdResolve,
    },
  },
];
