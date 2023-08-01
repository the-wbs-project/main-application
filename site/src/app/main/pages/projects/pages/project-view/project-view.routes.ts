import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { TaskCreateService } from '@wbs/main/components/task-create';
import { TaskDeleteService } from '@wbs/main/components/task-delete';
import {
  projectTimelineVerifyGuard,
  projectVerifyGuard,
} from './project-view.guards';
import {
  ChecklistDataService,
  ProjectNavigationService,
  ProjectViewService,
} from './services';
import {
  ProjectChecklistState,
  ProjectState,
  ProjectTimelineState,
  ProjectViewState,
  TasksState,
} from './states';

export const routes: Routes = [
  {
    path: ':projectId',
    canActivate: [projectVerifyGuard, projectTimelineVerifyGuard],
    loadComponent: () =>
      import('./project-view-layout.component').then(
        (m) => m.ProjectViewLayoutComponent
      ),
    loadChildren: () => import('./pages/children.routes').then((m) => m.routes),
    providers: [
      importProvidersFrom(
        NgxsModule.forFeature([
          ProjectChecklistState,
          ProjectTimelineState,
          ProjectViewState,
          ProjectState,
          TasksState,
        ])
      ),
      ChecklistDataService,
      ProjectNavigationService,
      ProjectViewService,
      TaskCreateService,
      TaskDeleteService,
    ],
  },
];
