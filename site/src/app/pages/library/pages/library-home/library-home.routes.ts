import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { TitleService, orgResolve } from '@wbs/core/services';
import { MembershipStore, UiStore } from '@wbs/core/store';
import { WrapperComponent } from '@wbs/pages/wrapper.component';
import { LibraryHomeService } from './services';

export const loadGuard = () => {
  inject(TitleService).setTitle([{ text: 'General.Library' }]);
  inject(UiStore).setBreadcrumbs([{ text: 'General.Library' }]);
};

export const redirectGuard = () =>
  inject(Store).dispatch(
    new Navigate([
      inject(MembershipStore).membership()!.name,
      'library',
      'home',
      inject(LibraryHomeService).selectedLibrary,
    ])
  );

export const routes: Routes = [
  {
    path: '',
    canActivate: [redirectGuard],
    providers: [LibraryHomeService],
    component: WrapperComponent,
  },
  {
    path: ':library',
    loadComponent: () =>
      import('./library-home.component').then((x) => x.LibraryHomeComponent),
    canActivate: [loadGuard],
    resolve: {
      org: orgResolve,
    },
  },
];
