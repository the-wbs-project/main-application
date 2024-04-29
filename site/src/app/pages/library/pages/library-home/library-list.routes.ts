import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { TitleService } from '@wbs/core/services';
import { orgResolve } from '@wbs/main/services';
import { UiStore } from '@wbs/store';

export const loadGuard = () => {
  inject(TitleService).setTitle('General.Library', true);
  inject(UiStore).setBreadcrumbs([{ text: 'General.Library' }]);
};

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./library-list.component').then((x) => x.LibraryListComponent),
    canActivate: [loadGuard],
    resolve: {
      org: orgResolve,
    },
  },
];
