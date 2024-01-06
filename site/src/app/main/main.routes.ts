import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { authGuardFn } from '@auth0/auth0-angular';
import { NgxsModule } from '@ngxs/store';
import { orgGuard } from './guards';
import {
  UserService,
  orgClaimsResolve,
  orgListResolve,
  orgObjResolve,
} from './services';
import {
  AiState,
  AuthState,
  MembershipState,
  MetadataState,
  RoleState,
  UiState,
} from './states';

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
          MembershipState,
          MetadataState,
          RoleState,
          UiState,
        ])
      ),
      UserService,
    ],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./main.component').then((m) => m.MainComponent),
      },
      {
        path: ':owner',
        canActivate: [orgGuard],
        loadComponent: () =>
          import('./main.component').then((m) => m.MainComponent),
        children: [
          {
            path: 'library',
            loadChildren: () =>
              import('./pages/library/library.routes').then((m) => m.routes),
          },
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
        resolve: {
          claims: orgClaimsResolve,
          org: orgObjResolve,
          orgs: orgListResolve,
        },
      },
    ],
  },
];
