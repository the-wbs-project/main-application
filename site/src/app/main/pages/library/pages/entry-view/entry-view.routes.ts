import { Routes } from '@angular/router';
import { dirtyGuard } from '@wbs/main/guards';
import {
  CategorySelectionService,
  Transformers,
  disciplineResolver,
  projectCategoryResolver,
} from '@wbs/main/services';
import {
  EntryActivityService,
  EntryService,
  EntryState,
  EntryTaskActionService,
  EntryTaskActivityService,
  EntryTaskRecorderService,
  EntryTaskService,
  entryIdResolve,
  entryNavGuard,
  entryUrlResolve,
  libraryClaimsResolve,
  ownerIdResolve,
  populateGuard,
  redirectGuard,
  versionIdResolve,
} from './services';

export const routes: Routes = [
  {
    path: ':ownerId/:entryId/:versionId',
    canActivate: [populateGuard],
    loadComponent: () =>
      import('./view-entry.component').then((m) => m.EntryViewComponent),
    providers: [
      CategorySelectionService,
      EntryActivityService,
      EntryService,
      EntryState,
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
        canActivate: [entryNavGuard],
        data: {
          section: 'about',
        },
        resolve: {
          claims: libraryClaimsResolve,
          disciplines: disciplineResolver,
        },
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./pages/entry-tasks').then((x) => x.TasksPageComponent),
        canActivate: [entryNavGuard],
        data: {
          section: 'tasks',
        },
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
        canActivate: [entryNavGuard],
        data: {
          section: 'resources',
        },
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
        canActivate: [entryNavGuard],
        data: {
          section: 'settings',
        },
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
        canActivate: [entryNavGuard],
        canDeactivate: [dirtyGuard],
        data: {
          section: 'settings',
        },
        resolve: {
          cats: disciplineResolver,
        },
      },
      {
        path: 'settings/phase',
        loadComponent: () =>
          import('./pages/entry-settings-phase.component').then(
            (x) => x.PhaseComponent
          ),
        canActivate: [entryNavGuard],
        canDeactivate: [dirtyGuard],
        data: {
          section: 'settings',
        },
      },
      {
        path: 'settings/phases',
        loadComponent: () =>
          import('./pages/entry-settings-phases.component').then(
            (x) => x.PhasesComponent
          ),
        canActivate: [entryNavGuard],
        canDeactivate: [dirtyGuard],
        data: {
          section: 'settings',
        },
      },
    ],
  },
];
