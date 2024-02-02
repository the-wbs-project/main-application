import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import {
  DialogService,
  Transformers,
  orgResolve,
  userIdResolve,
} from '@wbs/main/services';
import {
  entryIdResolve,
  libraryClaimsResolve,
  redirectGuard,
  verifyGuard,
} from './services';
import { EntryViewState } from './states';
import { versionIdResolve } from './services/version-id-resolver.service';

export const routes: Routes = [
  {
    path: ':entryId/:versionId',
    canActivate: [verifyGuard],
    loadComponent: () =>
      import('./entry-view.component').then((m) => m.EntryViewComponent),
    providers: [
      importProvidersFrom(NgxsModule.forFeature([EntryViewState])),
      DialogService,
      Transformers,
    ],
    resolve: {
      owner: orgResolve,
      userId: userIdResolve,
      claims: libraryClaimsResolve,
    },
    children: [
      {
        path: '',
        canActivate: [redirectGuard],
        loadComponent: () =>
          import('./pages/entry/about').then((x) => x.AboutPageComponent),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./pages/entry/about').then((x) => x.AboutPageComponent),
      },
      {
        path: 'resources',
        loadComponent: () =>
          import('./pages/entry/resources-page.component').then(
            (x) => x.ResourcesPageComponent
          ),
        resolve: {
          owner: orgResolve,
          entryId: entryIdResolve,
          versionId: versionIdResolve,
          claims: libraryClaimsResolve,
        },
      },
    ],
  },
];
