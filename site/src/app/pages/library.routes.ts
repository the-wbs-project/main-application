import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  LibraryActivityService,
  LibraryTaskActivityService,
  LibraryResourcesService,
} from '@wbs/core/services';
import { UserStore } from '@wbs/core/store';
import { map } from 'rxjs/operators';

const watcherGuard = () => {
  const store = inject(UserStore);

  return inject(DataServiceFactory)
    .libraryEntryWatchers.getEntriesAsync(store.userId()!)
    .pipe(
      map((list) => {
        store.watchers.library.set(list);
      })
    );
};

export const redirectGuard = () =>
  inject(Store).dispatch(new Navigate(['home']));

export const routes: Routes = [
  {
    path: '',
    canActivate: [watcherGuard],
    providers: [
      LibraryActivityService,
      LibraryTaskActivityService,
      LibraryResourcesService,
    ],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadChildren: () =>
          import('./library-home/library-home.routes').then((x) => x.routes),
      },
      {
        path: 'view',
        loadChildren: () =>
          import('./library-view/library-view.routes').then((x) => x.routes),
      },
    ],
  },
];
