import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { Utils } from '@wbs/core/services';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SetAsStarted } from '../actions';
import { EntryUploadState } from '../states';

function getEntryUrl(route: ActivatedRouteSnapshot): string[] {
  return [
    '/' + Utils.getParam(route, 'org'),
    'library',
    'view',
    Utils.getParam(route, 'ownerId'),
    Utils.getParam(route, 'recordId'),
    Utils.getParam(route, 'versionId'),
  ];
}

function redirect(store: Store, route: ActivatedRouteSnapshot) {
  return store
    .dispatch(new Navigate([...getEntryUrl(route), 'upload', 'start']))
    .pipe(map(() => true));
}

export const verifyStartedGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);

  return store
    .selectOnce(EntryUploadState.started)
    .pipe(
      switchMap((started) => (started ? of(true) : redirect(store, route)))
    );
};

export const startGuard = () => {
  const store = inject(Store);

  return store.dispatch(new SetAsStarted()).pipe(map(() => true));
};
