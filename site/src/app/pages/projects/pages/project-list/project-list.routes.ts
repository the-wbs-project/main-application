import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { TitleService, orgResolve, userIdResolve } from '@wbs/core/services';

export const setupGuard = () => {
  inject(TitleService).setTitle([{ text: 'General.Projects' }]);
};

export const routes: Routes = [
  {
    path: '',
    canActivate: [setupGuard],
    loadComponent: () =>
      import('./project-list.component').then((x) => x.ProjectListComponent),
    resolve: {
      orgId: orgResolve,
      userId: userIdResolve,
    },
  },
];
