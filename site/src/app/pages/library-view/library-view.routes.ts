import { Routes } from '@angular/router';
import {
  EntryTaskReorderService,
  LibraryActionService,
  LibraryImportService,
  LibraryService,
  LibraryTaskActionService,
  LibraryTaskService,
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
    children: [
      {
        path: '',
        redirectTo: 'about',
        pathMatch: 'full',
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./pages/about').then((x) => x.AboutPageComponent),
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./pages/tasks').then((x) => x.TasksPageComponent),
      },
    ],
  },
];
