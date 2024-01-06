import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { Store } from '@ngxs/store';
import { TitleService } from '@wbs/core/services';
import { SetBreadcrumbs } from '@wbs/main/actions';
import { Utils, orgResolve } from '@wbs/main/services';
import { map } from 'rxjs/operators';

export const loadGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const titleService = inject(TitleService);
  const owner = Utils.getOrgName(store, route);

  titleService.setTitle('Pages.Projects', true);

  return store
    .dispatch([
      //new LoadProjects(owner),
      new SetBreadcrumbs([
        {
          text: 'Pages.Projects',
        },
      ]),
    ])
    .pipe(map(() => true));
};

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./library-list.component').then((x) => x.LibraryListComponent),
    canActivate: [loadGuard],
    resolve: {
      owner: orgResolve,
    },
    //providers: [importProvidersFrom(NgxsModule.forFeature([ProjectListState]))],
  },
];
