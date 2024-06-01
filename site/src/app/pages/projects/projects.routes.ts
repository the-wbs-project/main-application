import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/project-list/project-list.routes').then((x) => x.routes),
  },
  {
    path: 'view',
    loadChildren: () =>
      import('./pages/project-view/project-view.routes').then((x) => x.routes),
  },
];
