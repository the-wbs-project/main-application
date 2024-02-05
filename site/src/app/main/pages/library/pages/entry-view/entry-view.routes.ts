import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import {
  DialogService,
  Transformers,
  orgResolve,
  phaseCategoryResolver,
  userIdResolve,
} from '@wbs/main/services';
import {
  entryIdResolve,
  libraryClaimsResolve,
  redirectGuard,
  verifyGuard,
  versionIdResolve,
} from './services';
import { EntryViewState } from './states';

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
        resolve: {},
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./pages/entry/tasks').then((x) => x.TasksPageComponent),
        resolve: {
          phases: phaseCategoryResolver,
        },
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
