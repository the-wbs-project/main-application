import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { Store } from '@ngxs/store';
import { TitleService } from '@wbs/core/services';
import { orgResolve, userIdResolve } from '@wbs/main/services';
import { UiStore } from '@wbs/store';
import { ProjectListService } from './services';

export const setupGuard = () => {
  const store = inject(Store);

  inject(TitleService).setTitle('Pages.Projects', true);
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
