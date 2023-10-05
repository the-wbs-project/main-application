import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./projects.component').then((x) => x.ProjectsComponent),
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/project-list/project-list.routes').then(
            (x) => x.routes
          ),
      },
      {
        path: 'create',
        loadChildren: () =>
          import('./pages/project-create/project-create.routes').then(
            (x) => x.routes
          ),
      },
      {
        path: 'view',
        loadChildren: () =>
          import('./pages/project-view/project-view.routes').then(
            (x) => x.routes
          ),
      },
      {
        path: 'upload',
        loadChildren: () =>
          import('./pages/project-upload/project-upload.routes').then(
            (x) => x.routes
          ),
      },
    ],
  },
];
