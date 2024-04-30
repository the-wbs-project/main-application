import { Routes } from '@angular/router';
import {
  EntryActivityService,
  EntryService,
  EntryTaskActivityService,
  EntryTaskService,
} from '@wbs/core/services';
import { EntryCreationService, watcherGuard } from './services';

export const routes: Routes = [
  {
    path: '',
    canActivate: [watcherGuard],
    providers: [
      EntryActivityService,
      EntryCreationService,
      EntryService,
      EntryTaskActivityService,
      EntryTaskService,
    ],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/library-home/library-home.routes').then(
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
