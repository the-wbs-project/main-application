import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { TaskCreateService } from '@wbs/main/components/task-create';
import { TaskDeleteService } from '@wbs/main/components/task-delete';
import { DialogService, ProjectPermissionsService } from '@wbs/main/services';
import { projectVerifyGuard } from './project-view.guards';
import {
  ChecklistDataService,
  ProjectNavigationService,
  ProjectViewService,
  TimelineService,
} from './services';
import {
  ProjectChecklistState,
  ProjectState,
  ProjectViewState,
  TasksState,
} from './states';

export const routes: Routes = [
  {
    path: ':projectId',
    canActivate: [projectVerifyGuard],
    loadComponent: () =>
      import('./project-view-layout.component').then(
        (m) => m.ProjectViewLayoutComponent
      ),
    loadChildren: () => import('./pages/children.routes').then((m) => m.routes),
    providers: [
      importProvidersFrom(
        NgxsModule.forFeature([
          ProjectChecklistState,
          ProjectViewState,
          ProjectState,
          TasksState,
        ])
      ),
      ChecklistDataService,
      DialogService,
      ProjectNavigationService,
      ProjectPermissionsService,
      ProjectViewService,
      TaskCreateService,
      TaskDeleteService,
      TimelineService,
    ],
  },
];
