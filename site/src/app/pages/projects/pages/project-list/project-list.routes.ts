import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { TitleService, userIdResolve } from '@wbs/core/services';
import { UiStore } from '@wbs/core/store';
import { ProjectListService } from './services';

export const setupGuard = () => {
  inject(TitleService).setTitle([{ text: 'General.Projects' }]);
  inject(UiStore).setBreadcrumbs([{ text: 'General.Projects' }]);
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
      userId: userIdResolve,
    },
    providers: [ProjectListService],
  },
];
