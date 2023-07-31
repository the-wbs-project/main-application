import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { HeaderService } from '@wbs/core/services';
import { map } from 'rxjs/operators';

export const redirectGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);

  return store
    .dispatch(
      new Navigate(['/projects', 'list', route.params['type'], 'active'])
    )
    .pipe(map(() => true));
}

export const routes: Routes = [
  {
    path: ':type',
    loadComponent: () =>
      import('./project-list.component').then(({ ProjectListComponent }) => ProjectListComponent),
    canActivate: [redirectGuard],
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
