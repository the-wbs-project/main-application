import { Routes } from '@angular/router';
import { headerGuard, redirectGuard, titleGuard } from './project-list.guards';

export const routes: Routes = [
  {
    path: ':type',
    loadComponent: () =>
      import('./project-list.component').then(
        ({ ProjectListComponent }) => ProjectListComponent
      ),
    canActivate: [redirectGuard],
  },
  {
    path: ':type/:status',
    loadComponent: () =>
      import('./project-list.component').then(
        ({ ProjectListComponent }) => ProjectListComponent
      ),
    canActivate: [titleGuard, headerGuard],
  },
];
