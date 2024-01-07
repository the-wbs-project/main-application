import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/library-home/library-list.routes').then((x) => x.routes),
  },
  {
    path: 'create',
    loadChildren: () =>
      import('./pages/entry-create/library-create.routes').then(
        (x) => x.routes
      ),
  },
];
