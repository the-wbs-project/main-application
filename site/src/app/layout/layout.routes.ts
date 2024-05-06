import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { importProvidersFrom, inject } from '@angular/core';
import { Routes } from '@angular/router';
import { authGuardFn } from '@auth0/auth0-angular';
import { NgxsModule } from '@ngxs/store';
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
  Logger,
  NavigationMenuService,
  UserService,
  orgClaimsResolve,
  orgListResolve,
  rolesResolve,
} from '@wbs/core/services';
import { MembershipState } from '@wbs/main/states';
import { LoggerRequestInterceptor } from '@wbs/setup/logger.http-interceptor';
import { MetadataStore } from '@wbs/store';

export const routes: Routes = [
  {
    path: '',
    canActivate: [
      authGuardFn,
      () => inject(MetadataStore).loadAsync(),
      authGuard,
    ],
    providers: [
      importProvidersFrom(NgxsModule.forFeature([MembershipState])),
      Auth0Service,
      Logger,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: LoggerRequestInterceptor,
        multi: true,
      },
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
          orgs: orgListResolve,
          roles: rolesResolve,
        },
      },
    ],
  },
];
