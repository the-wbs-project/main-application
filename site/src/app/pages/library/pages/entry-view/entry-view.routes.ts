import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { EntryUploadState } from './pages/entry-upload/states';
import {
  EntryActionButtonService,
  EntryTaskActionService,
  EntryTaskReorderService,
  LibraryImportProcessorService,
  entryApiUrlResolve,
  entryIdResolve,
  entryNavGuard,
  entryUrlResolve,
  ownerIdResolve,
  populateGuard,
  redirectGuard,
  verifyTaskUpdateClaimGuard,
  versionIdResolve,
} from './services';

export const routes: Routes = [
  {
    path: ':ownerId/:entryId/:versionId',
    canActivate: [populateGuard],
    loadComponent: () =>
      import('./view-entry.component').then((m) => m.EntryViewComponent),
    providers: [
      importProvidersFrom(NgxsModule.forFeature([EntryUploadState])),
      EntryActionButtonService,
      EntryTaskActionService,
      EntryTaskReorderService,
      LibraryImportProcessorService,
    ],
    resolve: {
      owner: ownerIdResolve,
      entryId: entryIdResolve,
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
        canActivate: [entryNavGuard],
        data: {
          section: 'about',
          crumbs: ['about'],
        },
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./pages/entry-tasks').then((x) => x.TasksPageComponent),
        canActivate: [entryNavGuard],
        data: {
          section: 'tasks',
          crumbs: ['tasks'],
        },
        resolve: {
          entryUrl: entryUrlResolve,
        },
      },
      {
        path: 'upload',
        loadComponent: () =>
          import('./pages/entry-upload/upload-layout.component').then(
            (x) => x.ProjectUploadLayoutComponent
          ),
        canActivate: [entryNavGuard, verifyTaskUpdateClaimGuard],
        data: {
          section: 'tasks',
        },
        loadChildren: () =>
          import('./pages/entry-upload/pages/children.routes').then(
            (x) => x.routes
          ),
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
          crumbs: ['resources'],
        },
        resolve: {
          owner: ownerIdResolve,
          entryId: entryIdResolve,
          versionId: versionIdResolve,
          apiUrlPrefix: entryApiUrlResolve,
        },
      },
    ],
  },
];
