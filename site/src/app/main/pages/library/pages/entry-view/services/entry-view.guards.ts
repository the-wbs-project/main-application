import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Utils } from '@wbs/main/services';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { EntryState } from './entry-state.service';

export const redirectGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);

  return store
    .dispatch(
      new Navigate([
        '/' + Utils.getParam(route, 'org'),
        'library',
        'view',
        route.params['ownerId'],
        route.params['entryId'],
        route.params['versionId'],
        'about',
      ])
    )
    .pipe(map(() => true));
};

export const redirectTaskGuard = (route: ActivatedRouteSnapshot) =>
  inject(Store)
    .dispatch(
      new Navigate([
        Utils.getParam(route, 'org'),
        'library',
        'view',
        Utils.getParam(route, 'ownerId'),
        Utils.getParam(route, 'entryId'),
        Utils.getParam(route, 'versionId'),
        'tasks',
        route.params['taskId'],
        'about',
      ])
    )
    .pipe(map(() => true));

export const populateGuard = (route: ActivatedRouteSnapshot) => {
  const data = inject(DataServiceFactory);
  const state = inject(EntryState);
  const owner = Utils.getParam(route, 'ownerId');
  const entryId = Utils.getParam(route, 'entryId');
  const versionId = parseInt(Utils.getParam(route, 'versionId'), 10);

  if (!owner || !entryId || !versionId || isNaN(versionId)) return false;

  return forkJoin({
    entry: data.libraryEntries.getAsync(owner, entryId),
    version: data.libraryEntryVersions.getAsync(owner, entryId, versionId),
    tasks: data.libraryEntryNodes.getAllAsync(owner, entryId, versionId),
  }).pipe(
    map(({ entry, version, tasks }) => {
      state.setAll(entry, version, tasks);

      return true;
    })
  );
};
