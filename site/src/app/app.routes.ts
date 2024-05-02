import { Routes } from '@angular/router';
import { authGuardFn } from '@auth0/auth0-angular';
import {
  authGuard,
  librarySectionGuard,
  navToOrgGuard,
  orgGuard,
  projectsSectionGuard,
  settingsSectionGuard,
} from './core/guards';
import { importProvidersFrom, inject } from '@angular/core';
import { MetadataStore } from './store';
import { NgxsModule } from '@ngxs/store';
import { AiState, MembershipState } from './main/states';
import {
  AiChatServiceFactory,
  NavigationMenuService,
  UserService,
  orgClaimsResolve,
  orgListResolve,
  rolesResolve,
} from './main/services';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login.component').then((x) => x.LoginComponent),
  },
  {
    path: 'logout',
    loadComponent: () =>
      import('./pages/logout.component').then((x) => x.LogoutComponent),
  },
  {
    path: '',
    canActivate: [
      authGuardFn,
      () => inject(MetadataStore).loadAsync(),
      authGuard,
    ],
    providers: [
      importProvidersFrom(NgxsModule.forFeature([AiState, MembershipState])),
      AiChatServiceFactory,
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
          import('./layout/layout.component').then((m) => m.LayoutComponent),
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
