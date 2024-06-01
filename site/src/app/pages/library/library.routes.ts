import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { DialogModule } from '@progress/kendo-angular-dialog';
import {
  EntryActivityService,
  EntryService,
  EntryTaskActivityService,
  EntryTaskService,
} from '@wbs/core/services/library';
import { EntryCreationService, watcherGuard } from './services';

export const routes: Routes = [
  {
    path: '',
    canActivate: [watcherGuard],
    providers: [
      importProvidersFrom([DialogModule]),
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
