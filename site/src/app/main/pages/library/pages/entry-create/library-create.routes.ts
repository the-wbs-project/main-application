import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { LibraryEntryCreateService } from './services';
import { LibraryCreateState } from './states';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./library-create.component').then(
        (x) => x.LibraryCreateComponent
      ),
    providers: [
      importProvidersFrom(NgxsModule.forFeature([LibraryCreateState])),
      LibraryEntryCreateService,
    ],
    loadChildren: () => import('./pages/children.routes').then((m) => m.routes),
  },
];
