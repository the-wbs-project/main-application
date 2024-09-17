import { Routes } from '@angular/router';
import {
  EntryTaskReorderService,
  LibraryActionService,
  LibraryImportService,
  LibraryService,
  LibraryTaskActionService,
  LibraryTaskService,
  entryUrlResolve,
  redirectGuard,
} from './services';

export const routes: Routes = [
  {
    path: ':ownerId/:recordId/:versionId',
    loadComponent: () =>
      import('./library-view.component').then((m) => m.LibraryViewComponent),
    providers: [
      EntryTaskReorderService,
      LibraryActionService,
      LibraryImportService,
      LibraryService,
      LibraryTaskActionService,
      LibraryTaskService,
    ],
    resolve: {
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
