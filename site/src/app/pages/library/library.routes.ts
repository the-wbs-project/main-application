import { Routes } from '@angular/router';
import { watcherGuard } from './services';

export const routes: Routes = [
  {
    path: '',
    canActivate: [watcherGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/library-home/library-list.routes').then(
            (x) => x.routes
          ),
      },
      {
        path: 'view',
        loadChildren: () =>
          import('./pages/entry-view/entry-view.routes').then((x) => x.routes),
      },
    ],
  },
];
