import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/library-home/library-list.routes').then((x) => x.routes),
  },
  {
    path: 'view',
    loadChildren: () =>
      import('./pages/entry-view/entry-view.routes').then((x) => x.routes),
  },
];
