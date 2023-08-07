import { Routes } from '@angular/router';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { headerGuard, redirectGuard } from './project-list.guards';

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
    canActivate: [
      () =>
        headerGuard({
          title: 'General.Projects',
          titleIsResource: true,
          rightButtons: [
            {
              text: 'Projects.CreateProject',
              icon: faPlus,
              route: ['/', 'projects', 'create'],
              theme: 'primary',
              type: 'link',
            },
          ],
        }),
    ],
  },
];
