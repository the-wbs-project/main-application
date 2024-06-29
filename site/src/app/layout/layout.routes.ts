import { Routes } from '@angular/router';
import { authGuardFn } from '@auth0/auth0-angular';
import {
  authGuard,
  librarySectionGuard,
  navToOrgGuard,
  orgGuard,
  projectsSectionGuard,
  settingsSectionGuard,
} from '@wbs/core/guards';
import {
  AiChatServiceFactory,
  Auth0Service,
  NavigationMenuService,
  orgClaimsResolve,
  rolesResolve,
} from '@wbs/core/services';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuardFn, authGuard],
    providers: [Auth0Service, AiChatServiceFactory, NavigationMenuService],
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
          import('./layout.component').then((m) => m.LayoutComponent),
        children: [
          {
            path: 'library',
            canActivate: [librarySectionGuard],
            loadChildren: () =>
              import('../pages/library/library.routes').then((m) => m.routes),
          },
          {
            path: 'projects',
            canActivate: [projectsSectionGuard],
            loadChildren: () =>
              import('../pages/projects/projects.routes').then((m) => m.routes),
          },
          {
            path: 'settings',
            canActivate: [settingsSectionGuard],
            loadChildren: () =>
              import('../pages/settings/settings.routes').then((m) => m.routes),
          },
        ],
        resolve: {
          claims: orgClaimsResolve,
          roles: rolesResolve,
        },
      },
    ],
  },
];
