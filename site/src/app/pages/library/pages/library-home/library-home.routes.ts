import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { TitleService } from '@wbs/core/services';
import { orgResolve } from '@wbs/main/services';
import { UiStore } from '@wbs/store';

export const loadGuard = () => {
  inject(TitleService).setTitle([{ text: 'General.Library' }]);
  inject(UiStore).setBreadcrumbs([{ text: 'General.Library' }]);
};

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./library-home.component').then((x) => x.LibraryHomeComponent),
    canActivate: [loadGuard],
    resolve: {
      org: orgResolve,
    },
  },
];
