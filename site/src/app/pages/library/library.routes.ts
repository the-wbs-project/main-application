import { importProvidersFrom, inject } from '@angular/core';
import { Routes } from '@angular/router';
import { DialogModule } from '@progress/kendo-angular-dialog';
import {
  EntryActivityService,
  EntryTaskActivityService,
  LibraryResourcesService,
  watcherGuard,
} from './services';
import { Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';

export const redirectGuard = () =>
  inject(Store).dispatch(new Navigate(['home']));

export const routes: Routes = [
  {
    path: '',
    canActivate: [watcherGuard],
    providers: [
      importProvidersFrom([DialogModule]),
      EntryActivityService,
      EntryTaskActivityService,
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
          import('./pages/library-home/library-home.routes').then(
            (x) => x.routes
          ),
      },
      {
        path: 'view',
        loadChildren: () =>
          import('./pages/entry-view/entry-view.routes').then((x) => x.routes),
      },
    ],
  },
];
