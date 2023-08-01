import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'list',
    loadChildren: () =>
      import('./pages/project-list/project-list.routes').then(
        ( { routes }) => routes
      ),
  },
  {
    path: 'create',
    loadChildren: () =>
      import('./pages/project-create/project-create.routes').then(
        ( { routes }) => routes
      ),
  },
  {
    path: 'view',
    loadChildren: () =>
      import('./pages/project-view/project-view.routes').then(
        ( { routes }) => routes
      ),
  },
  {
    path: ':projectId/upload',
    loadChildren: () =>
      import('./pages/project-upload/project-upload.routes').then(
        ( { routes }) => routes
      ),
  },
];
