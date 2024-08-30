import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { LIBRARY_CLAIMS } from '@wbs/core/models';
import { Utils } from '@wbs/core/services';
import { EntryStore } from '@wbs/core/store';
import { forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

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

export const populateGuard = (route: ActivatedRouteSnapshot) => {
  const data = inject(DataServiceFactory);
  const store = inject(EntryStore);
  const org = Utils.getParam(route, 'org');
  const owner = Utils.getParam(route, 'ownerId');
  const recordId = Utils.getParam(route, 'recordId');
  const versionId = parseInt(Utils.getParam(route, 'versionId'), 10);

  if (!owner || !recordId || !versionId || isNaN(versionId)) return false;

  const visibility = org === owner ? 'private' : 'public';

  return data.libraryEntries.getIdAsync(owner, recordId).pipe(
    switchMap((entryId) =>
      forkJoin({
        versions: data.libraryEntryVersions.getAsync(owner, entryId),
        version: data.libraryEntryVersions.getByIdAsync(
          owner,
          entryId,
          versionId
        ),
        tasks: data.libraryEntryNodes.getAllAsync(
          owner,
          entryId,
          versionId,
          visibility
        ),
        claims: data.claims.getLibraryEntryClaimsAsync(
          org,
          owner,
          entryId,
          versionId
        ),
      })
    ),
    map(({ versions, version, tasks, claims }) => {
      store.setAll(versions, version, tasks, claims);
    })
  );
};

export const verifyClaimsGuard = (route: ActivatedRouteSnapshot) => {
  const data = inject(DataServiceFactory);
  const org = Utils.getParam(route, 'org');
  const owner = Utils.getParam(route, 'ownerId');
  const recordId = Utils.getParam(route, 'recordId');
  const version = parseInt(Utils.getParam(route, 'versionId'), 10);

  if (!owner || !recordId) return false;

  return data.libraryEntries
    .getIdAsync(owner, recordId)
    .pipe(
      switchMap((entryId) =>
        data.claims
          .getLibraryEntryClaimsAsync(org, owner, entryId, version)
          .pipe(map((claims) => claims.includes(LIBRARY_CLAIMS.TASKS.UPDATE)))
      )
    );
};
