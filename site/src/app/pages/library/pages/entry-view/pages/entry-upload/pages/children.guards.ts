import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { SetBreadcrumbs } from '@wbs/main/actions';
import { Utils } from '@wbs/main/services';
import { of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { SetAsStarted } from '../actions';
import { EntryUploadState } from '../states';
import { EntryStore } from '@wbs/store';

function getEntryUrl(route: ActivatedRouteSnapshot): string[] {
  return [
    '/' + Utils.getParam(route, 'org'),
    'library',
    'view',
    Utils.getParam(route, 'ownerId'),
    Utils.getParam(route, 'entryId'),
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

  return store.selectOnce(EntryUploadState.started).pipe(
    tap((started) => console.log(started)),
    switchMap((started) => (started ? of(true) : redirect(store, route)))
  );
};

export const startGuard = () => {
  const store = inject(Store);

  return store.dispatch(new SetAsStarted()).pipe(map(() => true));
};

export const setupGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const entryStore = inject(EntryStore);
  const entryUrl = getEntryUrl(route);
  const title = entryStore.version()!.title;

  return (
    store.dispatch([
      /* new SetHeaderInformation(
            route.data['title'],
            route.data['description']
          ),*/
      new SetBreadcrumbs([
        {
          route: ['/', Utils.getParam(route, 'org'), 'library'],
          text: 'General.Library',
        },
        {
          route: [...entryUrl, 'view'],
          text: title,
          isText: true,
        },
        {
          route: [...entryUrl, 'upload'],
          text: 'General.Upload',
        },
        {
          text: route.data['title'],
        },
      ]),
    ]),
    map(() => true)
  );
};
