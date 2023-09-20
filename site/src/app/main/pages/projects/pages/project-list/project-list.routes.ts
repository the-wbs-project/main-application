import { importProvidersFrom, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { NgxsModule, Store } from '@ngxs/store';
import { Resources, TitleService } from '@wbs/core/services';
import { SetBreadcrumbs } from '@wbs/main/actions';
import { MembershipState } from '@wbs/main/states';
import { map } from 'rxjs/operators';
import { ProjectListState } from './states';
import { LoadProjects } from './actions';

export const loadGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const resources = inject(Resources);
  const titleService = inject(TitleService);
  const title = resources.get('Pages.Projects');
  const owner =
    route.params['owner'] ??
    store.selectSnapshot(MembershipState.organization)?.name;

  titleService.setTitle(title, false);

  return store
    .dispatch([new LoadProjects(owner), new SetBreadcrumbs([], title)])
    .pipe(map(() => true));
};

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./project-list.component').then(
        ({ ProjectListComponent }) => ProjectListComponent
      ),
    canActivate: [loadGuard],
    providers: [importProvidersFrom(NgxsModule.forFeature([ProjectListState]))],
  },
];
