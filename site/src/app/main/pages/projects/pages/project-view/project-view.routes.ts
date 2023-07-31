import { Routes } from '@angular/router';
import { projectTimelineVerifyGuard, projectVerifyGuard } from './project-view.guards';
import { importProvidersFrom } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ProjectChecklistState, ProjectState, ProjectTimelineState, ProjectViewState } from './states';

export const routes: Routes = [
  {
    path: ':projectId',
    canActivate: [projectVerifyGuard, projectTimelineVerifyGuard],
    loadComponent: () => import('./project-view-layout.component').then((m) => m.ProjectViewLayoutComponent),
    loadChildren: () => import('./pages/children.routes').then((m) => m.routes),
    providers: [importProvidersFrom(NgxsModule.forFeature([
      ProjectChecklistState,
      ProjectTimelineState,
      ProjectViewState,ProjectState
    ]))],
  },
];
