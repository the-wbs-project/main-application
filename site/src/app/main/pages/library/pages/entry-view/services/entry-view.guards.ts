import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { Utils } from '@wbs/main/services';
import { map } from 'rxjs/operators';
import { VerifyEntry, VerifyEntryTasks } from '../actions';

export const redirectGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const owner = Utils.getOrgName(store, route);

  return store
    .dispatch(
      new Navigate([
        owner,
        'library',
        'view',
        route.params['entryId'],
        route.params['versionId'],
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

export const tasksVerifyGuard = () =>
  inject(Store)
    .dispatch(new VerifyEntryTasks())
    .pipe(map(() => true));

export const taskVerifyGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const taskId = route.params['taskId'];

  if (!taskId) return false;

  return true;
  //return store
  //  .dispatch([new VerifyTask(PROJECT_NODE_VIEW.PHASE, taskId)])
  //  .pipe(map(() => true));
};
