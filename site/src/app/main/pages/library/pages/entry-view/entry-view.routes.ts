import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { TaskCreateService } from '@wbs/main/components/task-create';
import {
  aboutSubSectionGuard,
  resourcesSubSectionGuard,
  tasksSubSectionGuard,
} from '@wbs/main/guards';
import {
  DialogService,
  Transformers,
  orgResolve,
  phaseCategoryResolver,
  userIdResolve,
} from '@wbs/main/services';
import {
  EntryActivityService,
  EntryService,
  EntryTaskActionService,
  EntryTaskActivityService,
  EntryTaskRecorderService,
  EntryTaskService,
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
      import('./view-entry.component').then((m) => m.EntryViewComponent),
    providers: [
      importProvidersFrom(NgxsModule.forFeature([EntryViewState])),
      DialogService,
      EntryActivityService,
      EntryService,
      EntryTaskActionService,
      EntryTaskActivityService,
      EntryTaskRecorderService,
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
          import('./pages/entry-about').then((x) => x.AboutPageComponent),
      },
      {
        path: 'setup',
        loadComponent: () =>
          import('./pages/entry-setup').then((x) => x.SetupPageComponent),
        canActivate: [],
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./pages/entry-about').then((x) => x.AboutPageComponent),
        canActivate: [aboutSubSectionGuard],
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./pages/tasks').then((x) => x.TasksPageComponent),
        canActivate: [tasksSubSectionGuard],
        resolve: {
          claims: libraryClaimsResolve,
          phases: phaseCategoryResolver,
        },
        loadChildren: () => import('./task-view.routes').then((x) => x.routes),
      },
      {
        path: 'resources',
        loadComponent: () =>
          import('./pages/entry-resources-page.component').then(
            (x) => x.ResourcesPageComponent
          ),
        canActivate: [resourcesSubSectionGuard],
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
