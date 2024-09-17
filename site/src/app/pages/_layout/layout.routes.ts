import { Routes } from '@angular/router';
import { authGuardFn } from '@auth0/auth0-angular';
import {
  AiChatServiceFactory,
  Auth0Service,
  orgClaimsResolve,
} from '@wbs/core/services';
import {
  authGuard,
  librarySectionGuard,
  navToOrgGuard,
  orgGuard,
  projectsSectionGuard,
  settingsSectionGuard,
} from './guards';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuardFn, authGuard],
    providers: [Auth0Service, AiChatServiceFactory],
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
              import('../library/library.routes').then((m) => m.routes),
          },
          {
            path: 'projects',
            canActivate: [projectsSectionGuard],
            loadChildren: () =>
              import('../projects/projects.routes').then((m) => m.routes),
          },
          {
            path: 'settings',
            canActivate: [settingsSectionGuard],
            loadChildren: () =>
              import('../settings/settings.routes').then((m) => m.routes),
          },
        ],
        resolve: {
          claims: orgClaimsResolve,
        },
      },
    ],
  },
];
