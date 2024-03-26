import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { Store } from '@ngxs/store';
import { TitleService } from '@wbs/core/services';
import { SetBreadcrumbs } from '@wbs/main/actions';
import { orgResolve } from '@wbs/main/services';
import { map } from 'rxjs/operators';

export const loadGuard = () => {
  const store = inject(Store);
  const titleService = inject(TitleService);

  titleService.setTitle('General.Library', true);

  return store
    .dispatch([new SetBreadcrumbs([{ text: 'General.Library' }])])
    .pipe(map(() => true));
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
