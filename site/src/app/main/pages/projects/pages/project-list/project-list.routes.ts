import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { HeaderService } from '@wbs/core/services';
import { RedirectGuard } from './guards';
import { ProjectListComponent } from './project-list.component';

export const routes: Routes = [
  {
    path: ':type',
    loadComponent: () =>
      import('./project-list.component').then(({ ProjectListComponent }) => ProjectListComponent),
    canActivate: [RedirectGuard],
  },
  {
    path: ':type/:status',
    loadComponent: () =>
      import('./project-list.component').then(({ ProjectListComponent }) => ProjectListComponent),
    canActivate: [
      () =>
        inject(HeaderService).headerGuard({
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
