import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { TitleService, orgResolve, userIdResolve } from '@wbs/core/services';
import { UiStore } from '@wbs/core/store';
import { ProjectListService } from './services';

export const setupGuard = () => {
  inject(TitleService).setTitle([{ text: 'Pages.Projects' }]);
  inject(UiStore).setBreadcrumbs([{ text: 'Pages.Projects' }]);
};

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./project-list.component').then(
        ({ ProjectListComponent }) => ProjectListComponent
      ),
    canActivate: [setupGuard],
    resolve: {
      owner: orgResolve,
      userId: userIdResolve,
    },
    providers: [ProjectListService],
  },
];
