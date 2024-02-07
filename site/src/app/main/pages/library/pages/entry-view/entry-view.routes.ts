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
  EntryTaskService,
  entryIdResolve,
  libraryClaimsResolve,
  redirectGuard,
  tasksVerifyGuard,
  verifyGuard,
  versionIdResolve,
} from './services';
import { EntryViewState } from './states';
import { TaskCreateService } from '@wbs/main/components/task-create';

export const routes: Routes = [
  {
    path: ':entryId/:versionId',
    canActivate: [verifyGuard],
    loadComponent: () =>
      import('./entry-view.component').then((m) => m.EntryViewComponent),
    providers: [
      importProvidersFrom(NgxsModule.forFeature([EntryViewState])),
      DialogService,
      EntryTaskService,
      TaskCreateService,
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
        canActivate: [tasksVerifyGuard],
        resolve: {
          claims: libraryClaimsResolve,
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
