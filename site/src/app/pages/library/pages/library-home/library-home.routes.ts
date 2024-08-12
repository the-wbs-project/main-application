import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { orgResolve, TitleService } from '@wbs/core/services';
import { MembershipStore, UiStore } from '@wbs/core/store';
import { WrapperComponent } from '@wbs/pages/wrapper.component';
import { LibraryHomeService } from './services';

export const loadGuard = () => {
  inject(TitleService).setTitle([{ text: 'General.Libraries' }]);
  inject(UiStore).setBreadcrumbs([{ text: 'General.Libraries' }]);
};

export const redirectGuard = () =>
  inject(Store).dispatch(
    new Navigate([
      inject(MembershipStore).membership()!.name,
      'library',
      'home',
      inject(LibraryHomeService).library(),
    ])
  );

export const setLibraryGuard = (route: ActivatedRouteSnapshot) =>
  inject(LibraryHomeService).setLibrary(route.url[0].path);

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./library-home.component').then((x) => x.LibraryHomeComponent),
    canActivate: [loadGuard],
    providers: [LibraryHomeService],
    children: [
      {
        path: '',
        canActivate: [redirectGuard],
        component: WrapperComponent,
      },
      {
        path: 'drafts',
        loadComponent: () =>
          import('./pages/drafts.component').then((x) => x.DraftsComponent),
        canActivate: [setLibraryGuard],
        resolve: {
          org: orgResolve,
        },
      },
      {
        path: 'internal',
        loadComponent: () =>
          import('./pages/internal.component').then((x) => x.InternalComponent),
        canActivate: [setLibraryGuard],
        resolve: {
          org: orgResolve,
        },
      },
    ],
  },
];
