import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { DialogService, Transformers, userIdResolve } from '@wbs/main/services';
import { libraryClaimsResolve, verifyGuard } from './services';
import { EntryViewState } from './states';

export const routes: Routes = [
  {
    path: ':entryId',
    canActivate: [verifyGuard],
    loadComponent: () =>
      import('./entry-view.component').then((m) => m.EntryViewComponent),
    providers: [
      importProvidersFrom(NgxsModule.forFeature([EntryViewState])),
      DialogService,
      Transformers,
    ],
    resolve: {
      userId: userIdResolve,
      claims: libraryClaimsResolve,
    },
    children: [],
  },
];
