import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { SetBreadcrumbs } from '@wbs/main/actions';
import { Utils } from '@wbs/main/services';
import { map, switchMap } from 'rxjs/operators';
import { VerifyEntry } from '../actions';
import { EntryViewState } from '../states';
import { of } from 'rxjs';

export const redirectGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const owner = Utils.getOrgName(store, route);

  return store
    .dispatch(
      new Navigate([owner, 'library', 'view', route.params['entryId'], 'about'])
    )
    .pipe(map(() => true));
};

export const verifyGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const owner = Utils.getOrgName(store, route);

  console.log(owner);

  if (!owner) return false;

  return store
    .dispatch([
      //new InitiateChecklist(),
      new VerifyEntry(owner, route.params['entryId']),
    ])
    .pipe(
      switchMap(() => store.selectOnce(EntryViewState.entry)),
      switchMap((entry) => {
        if (!entry) return of(false);

        return store
          .dispatch([
            //new VerifyTasks(project, true),
            new SetBreadcrumbs([
              {
                route: ['/', owner, 'library'],
                text: 'General.Library',
              },
              {
                text: entry.title,
                isText: true,
              },
            ]),
          ])
          .pipe(map(() => true));
      })
    );
};

export const taskVerifyGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const taskId = route.params['taskId'];

  if (!taskId) return false;

  return true;
  //return store
  //  .dispatch([new VerifyTask(PROJECT_NODE_VIEW.PHASE, taskId)])
  //  .pipe(map(() => true));
};
