import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { authGuardFn } from '@auth0/auth0-angular';
import { NgxsModule } from '@ngxs/store';
import {
  AuthState,
  MetadataState,
  MembershipState,
  ProjectListState,
  UiState,
} from './states';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuardFn],
    loadComponent: () =>
      import('./main.component').then((m) => m.MainComponent),
    providers: [
      importProvidersFrom(
        NgxsModule.forFeature([
          AuthState,
          MetadataState,
          MembershipState,
          ProjectListState,
          UiState,
        ])
      ),
    ],
    children: [
      {
        path: 'projects',
        loadChildren: () =>
          import('./pages/projects/projects.routes').then((m) => m.routes),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./pages/settings/settings.routes').then((m) => m.routes),
      },
    ],
  },
];
