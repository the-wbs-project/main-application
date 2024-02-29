import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Utils } from '@wbs/main/services';
import { Observable, forkJoin, of } from 'rxjs';
import { first, map, skipWhile, switchMap } from 'rxjs/operators';
import { EntryViewState } from '../states';

export const libraryClaimsResolve: ResolveFn<string[]> = (
  route: ActivatedRouteSnapshot
) => getLibraryClaims(inject(DataServiceFactory), inject(Store), route);

export const ownerIdResolve: ResolveFn<string> = (
  route: ActivatedRouteSnapshot
) => getOwner(inject(Store), route);

export const entryIdResolve: ResolveFn<string> = (
  route: ActivatedRouteSnapshot
) => getEntry(inject(Store), route);

export const versionIdResolve: ResolveFn<number> = (
  route: ActivatedRouteSnapshot
) => getVersion(inject(Store), route);

export const taskIdResolve: ResolveFn<string> = (
  route: ActivatedRouteSnapshot
) => getTask(inject(Store), route);

export const entryUrlResolve: ResolveFn<string[]> = (
  route: ActivatedRouteSnapshot
) => getEntryUrl(inject(Store), route);

function getOwner(
  store: Store,
  route: ActivatedRouteSnapshot
): Observable<string> {
  const owner = route.params['ownerId'];

  return owner
    ? of(owner)
    : store.select(EntryViewState.entry).pipe(
        skipWhile((x) => x == undefined),
        map((x) => x!.owner),
        first()
      );
}

function getEntry(
  store: Store,
  route: ActivatedRouteSnapshot
): Observable<string> {
  const entryId = route.params['entryId'];

  return entryId
    ? of(entryId)
    : store.select(EntryViewState.entry).pipe(
        skipWhile((x) => x == undefined),
        map((x) => x!.id),
        first()
      );
}

function getVersion(
  store: Store,
  route: ActivatedRouteSnapshot
): Observable<number> {
  const version = parseInt(route.params['versionId']);

  return version
    ? of(version)
    : store.select(EntryViewState.version).pipe(
        skipWhile((x) => x == undefined),
        map((x) => x!.version),
        first()
      );
}

function getTask(
  store: Store,
  route: ActivatedRouteSnapshot
): Observable<string> {
  const taskId = route.params['taskId'];

  return taskId
    ? of(taskId)
    : store.select(EntryViewState.task).pipe(
        skipWhile((x) => x == undefined),
        map((x) => x!.id),
        first()
      );
}

function getLibraryClaims(
  data: DataServiceFactory,
  store: Store,
  route: ActivatedRouteSnapshot
): Observable<string[]> {
  return forkJoin({
    owner: getOwner(store, route),
    entryId: getEntry(store, route),
  }).pipe(
    switchMap(({ owner, entryId }) =>
      data.claims.getLibraryEntryClaimsAsync(owner, entryId)
    )
  );
}

function getEntryUrl(
  store: Store,
  route: ActivatedRouteSnapshot
): Observable<string[]> {
  return forkJoin({
    owner: getOwner(store, route),
    entryId: getEntry(store, route),
    versionId: getVersion(store, route),
  }).pipe(
    map(({ owner, entryId, versionId }) => [
      './' + Utils.getOrgName(store, route),
      'library',
      'view',
      owner,
      entryId,
      versionId.toString(),
    ])
  );
}
