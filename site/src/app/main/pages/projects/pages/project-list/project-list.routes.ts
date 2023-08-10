import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
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
    canActivate: [
      titleGuard,
      (route: ActivatedRouteSnapshot) =>
        headerGuard({
          title: 'General.Projects',
          titleIsResource: true,
          rightButtons: [
            {
              text: 'Projects.CreateProject',
              icon: faPlus,
              route: ['/', route.params['owner'], 'projects', 'create'],
              theme: 'primary',
              type: 'link',
            },
          ],
        }),
    ],
  },
];
