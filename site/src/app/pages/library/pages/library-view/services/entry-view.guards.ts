import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { Utils } from '@wbs/core/services';

export const redirectGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);

  return store.dispatch(
    new Navigate([
      '/',
      Utils.getParam(route, 'org'),
      'library',
      'view',
      Utils.getParam(route, 'ownerId'),
      Utils.getParam(route, 'recordId'),
      Utils.getParam(route, 'versionId'),
      'about',
    ])
  );
};
