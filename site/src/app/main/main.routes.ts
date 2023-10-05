import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { authGuardFn } from '@auth0/auth0-angular';
import { NgxsModule } from '@ngxs/store';
import {
  AuthState,
  MetadataState,
  MembershipState,
  UiState,
  RolesState,
  AiState,
} from './states';
import { ProjectPermissionsService, UserService } from './services';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuardFn],
    loadComponent: () =>
      import('./main-wrapper.component').then((m) => m.MainWrapperComponent),
    providers: [
      importProvidersFrom(
        NgxsModule.forFeature([
          AiState,
          AuthState,
          MetadataState,
          MembershipState,
          RolesState,
          UiState,
        ])
      ),
      UserService,
    ],
    children: [
      {
        path: 'loading',
        loadComponent: () =>
          import('./main-loading.component').then(
            (m) => m.MainLoadingComponent
          ),
      },
      {
        path: ':owner',
        loadComponent: () =>
          import('./main.component').then((m) => m.MainComponent),
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
    ],
  },
];
