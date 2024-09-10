import { Routes } from '@angular/router';
import {
  EntryTaskReorderService,
  LibraryActionService,
  LibraryImportService,
  LibraryService,
  LibraryTaskActionService,
  LibraryTaskService,
  entryUrlResolve,
  ownerIdResolve,
  populateGuard,
  redirectGuard,
} from './services';

export const routes: Routes = [
  {
    path: ':ownerId/:recordId/:versionId',
    canActivate: [populateGuard],
    loadComponent: () =>
      import('./view-entry.component').then((m) => m.EntryViewComponent),
    providers: [
      EntryTaskReorderService,
      LibraryActionService,
      LibraryImportService,
      LibraryService,
      LibraryTaskActionService,
      LibraryTaskService,
    ],
    resolve: {
      owner: ownerIdResolve,
      entryUrl: entryUrlResolve,
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
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./pages/entry-tasks').then((x) => x.TasksPageComponent),
        resolve: {
          entryUrl: entryUrlResolve,
        },
      },
    ],
  },
];
