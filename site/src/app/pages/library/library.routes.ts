import { Routes } from '@angular/router';
import {
  EntryActivityService,
  EntryService,
  EntryTaskActivityService,
  EntryTaskService,
} from '@wbs/core/services';
import { watcherGuard } from './services';
import { EntryStore } from '@wbs/store';

export const routes: Routes = [
  {
    path: '',
    canActivate: [watcherGuard],
    providers: [
      EntryActivityService,
      EntryService,
      EntryStore,
      EntryTaskActivityService,
      EntryTaskService,
    ],
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
