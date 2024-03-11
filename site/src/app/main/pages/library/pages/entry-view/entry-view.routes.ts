import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import {
  aboutSubSectionGuard,
  dirtyGuard,
  resourcesSubSectionGuard,
  settingsSubSectionGuard,
  tasksSubSectionGuard,
} from '@wbs/main/guards';
import {
  CategorySelectionService,
  Transformers,
  projectCategoryResolver,
} from '@wbs/main/services';
import {
  EntryActivityService,
  EntryService,
  EntryTaskActionService,
  EntryTaskActivityService,
  EntryTaskRecorderService,
  EntryTaskService,
  entryIdResolve,
  entryUrlResolve,
  libraryClaimsResolve,
  ownerIdResolve,
  redirectGuard,
  verifyGuard,
  versionIdResolve,
} from './services';
import { EntryViewState } from './states';

export const routes: Routes = [
  {
    path: ':ownerId/:entryId/:versionId',
    canActivate: [verifyGuard],
    loadComponent: () =>
      import('./view-entry.component').then((m) => m.EntryViewComponent),
    providers: [
      importProvidersFrom(NgxsModule.forFeature([EntryViewState])),
      CategorySelectionService,
      EntryActivityService,
      EntryService,
      EntryTaskActionService,
      EntryTaskActivityService,
      EntryTaskRecorderService,
      EntryTaskService,
      Transformers,
    ],
    resolve: {
      entryUrl: entryUrlResolve,
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
        path: 'about',
        loadComponent: () =>
          import('./pages/entry-about').then((x) => x.AboutPageComponent),
        canActivate: [aboutSubSectionGuard],
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./pages/entry-tasks').then((x) => x.TasksPageComponent),
        canActivate: [tasksSubSectionGuard],
        resolve: {
          entryUrl: entryUrlResolve,
          claims: libraryClaimsResolve,
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
          owner: ownerIdResolve,
          entryId: entryIdResolve,
          versionId: versionIdResolve,
          claims: libraryClaimsResolve,
        },
      },
      {
        path: 'settings/general',
        loadComponent: () =>
          import('./pages/entry-settings-general').then(
            (x) => x.GeneralComponent
          ),
        canActivate: [settingsSubSectionGuard],
        resolve: {
          categories: projectCategoryResolver,
        },
      },
      {
        path: 'settings/disciplines',
        loadComponent: () =>
          import('./pages/entry-settings-disciplines.component').then(
            (x) => x.DisciplinesComponent
          ),
        canActivate: [settingsSubSectionGuard],
        canDeactivate: [],
      },
      {
        path: 'settings/phase',
        loadComponent: () =>
          import('./pages/entry-settings-phase.component').then(
            (x) => x.PhaseComponent
          ),
        canActivate: [settingsSubSectionGuard],
        canDeactivate: [dirtyGuard],
      },
      {
        path: 'settings/phases',
        loadComponent: () =>
          import('./pages/entry-settings-phases.component').then(
            (x) => x.PhasesComponent
          ),
        canActivate: [settingsSubSectionGuard],
        canDeactivate: [dirtyGuard],
      },
    ],
  },
];
