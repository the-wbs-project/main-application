import { importProvidersFrom, inject } from '@angular/core';
import { Routes } from '@angular/router';
import { authGuardFn } from '@auth0/auth0-angular';
import { NgxsModule } from '@ngxs/store';
import { MetadataStore } from '@wbs/store';
import {
  authGuard,
  librarySectionGuard,
  navToOrgGuard,
  orgGuard,
  projectsSectionGuard,
  settingsSectionGuard,
} from './guards';
import {
  AiChatService,
  NavigationMenuService,
  UserService,
  orgClaimsResolve,
  orgListResolve,
  rolesResolve,
} from './services';
import { AiState, MembershipState, UiState } from './states';

export const routes: Routes = [
  {
    path: '',
    canActivate: [
      authGuardFn,
      () => inject(MetadataStore).loadAsync(),
      authGuard,
    ],
    providers: [
      importProvidersFrom(
        NgxsModule.forFeature([AiState, MembershipState, UiState])
      ),
      AiChatService,
      NavigationMenuService,
      UserService,
    ],
    children: [
      {
        path: '',
        canActivate: [navToOrgGuard],
        loadComponent: () =>
          import('@angular/router').then((m) => m.ɵEmptyOutletComponent),
      },
      {
        path: ':org',
        canActivate: [orgGuard],
        loadComponent: () =>
          import('./main.component').then((m) => m.MainComponent),
        children: [
          {
            path: 'library',
            canActivate: [librarySectionGuard],
            loadChildren: () =>
              import('./pages/library/library.routes').then((m) => m.routes),
          },
          {
            path: 'projects',
            canActivate: [projectsSectionGuard],
            loadChildren: () =>
              import('./pages/projects/projects.routes').then((m) => m.routes),
          },
          {
            path: 'settings',
            canActivate: [settingsSectionGuard],
            loadChildren: () =>
              import('./pages/settings/settings.routes').then((m) => m.routes),
          },
        ],
        resolve: {
          claims: orgClaimsResolve,
          orgs: orgListResolve,
          roles: rolesResolve,
        },
      },
    ],
  },
];
