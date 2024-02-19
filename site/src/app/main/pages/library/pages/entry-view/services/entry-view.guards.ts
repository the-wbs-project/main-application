import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { Utils } from '@wbs/main/services';
import { map } from 'rxjs/operators';
import { VerifyEntry, VerifyTask } from '../actions';
import { EntryViewState } from '../states';

export const redirectGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const owner = Utils.getOrgName(store, route);
  const tasks = store.selectSnapshot(EntryViewState.tasks) ?? [];

  return store
    .dispatch(
      new Navigate([
        owner,
        'library',
        'view',
        route.params['entryId'],
        route.params['versionId'],
        tasks.length > 0 ? 'about' : 'setup',
      ])
    )
    .pipe(map(() => true));
};

export const redirectTaskGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const entry = store.selectSnapshot(EntryViewState.entry)!;
  const version = store.selectSnapshot(EntryViewState.version)!;

  return store
    .dispatch(
      new Navigate([
        entry.owner,
        'library',
        'view',
        entry.id,
        version.version,
        'tasks',
        route.params['taskId'],
        'about',
      ])
    )
    .pipe(map(() => true));
};

export const verifyGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const owner = Utils.getOrgName(store, route);
  const entryId = route.params['entryId'];
  const versionId = parseInt(route.params['versionId'], 10);

  if (!owner || !entryId || !versionId || isNaN(versionId)) return false;

  return store
    .dispatch([new VerifyEntry(owner, entryId, versionId)])
    .pipe(map(() => true));
};

export const taskVerifyGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const taskId = route.params['taskId'];

  if (!taskId) return false;

  return store.dispatch([new VerifyTask(taskId)]).pipe(map(() => true));
};
