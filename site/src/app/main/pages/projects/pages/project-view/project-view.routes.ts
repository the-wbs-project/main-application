import { Routes } from '@angular/router';
import { ProjectTimelineVerifyGuard, ProjectVerifyGuard, } from './guards';

export const routes: Routes = [
  {
    path: ':projectId',
    canActivate: [ProjectVerifyGuard, ProjectTimelineVerifyGuard],
    loadComponent: () => import('./project-view-layout.component').then((m) => m.ProjectViewLayoutComponent),
    loadChildren: () => import('./pages/children.routes').then((m) => m.routes),
  },
];
