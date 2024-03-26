import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { Store } from '@ngxs/store';
import { TitleService } from '@wbs/core/services';
import { SetBreadcrumbs } from '@wbs/main/actions';
import {
  orgResolve,
  projectCategoryResolver,
  userIdResolve,
} from '@wbs/main/services';
import { map } from 'rxjs/operators';

export const setupGuard = () => {
  const store = inject(Store);

  inject(TitleService).setTitle('Pages.Projects', true);

  return store
    .dispatch([new SetBreadcrumbs([{ text: 'Pages.Projects' }])])
    .pipe(map(() => true));
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
      projectCategories: projectCategoryResolver,
    },
  },
];
