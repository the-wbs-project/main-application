import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Observable } from 'rxjs';

export const libraryClaimsResolve: ResolveFn<string[]> = (
  route: ActivatedRouteSnapshot
) => getLibraryClaims(inject(DataServiceFactory), route);

export const ownerIdResolve: ResolveFn<string> = (
  route: ActivatedRouteSnapshot
) => getParam(route, 'ownerId');

export const entryIdResolve: ResolveFn<string> = (
  route: ActivatedRouteSnapshot
) => getParam(route, 'entryId');

export const versionIdResolve: ResolveFn<number> = (
  route: ActivatedRouteSnapshot
) => parseInt(getParam(route, 'versionId'));

export const taskIdResolve: ResolveFn<string> = (
  route: ActivatedRouteSnapshot
) => getParam(route, 'taskId');

export const entryUrlResolve: ResolveFn<string[]> = (
  route: ActivatedRouteSnapshot
) => getEntryUrl(route);

function getLibraryClaims(
  data: DataServiceFactory,
  route: ActivatedRouteSnapshot
): Observable<string[]> {
  return data.claims.getLibraryEntryClaimsAsync(
    getParam(route, 'ownerId'),
    getParam(route, 'entryId')
  );
}

function getEntryUrl(route: ActivatedRouteSnapshot): string[] {
  return [
    './' + getParam(route, 'org'),
    'library',
    'view',
    getParam(route, 'ownerId'),
    getParam(route, 'entryId'),
    getParam(route, 'versionId'),
  ];
}

function getParam(route: ActivatedRouteSnapshot, prop: string): string {
  let r: ActivatedRouteSnapshot | null = route;

  while (r) {
    if (r.params[prop]) return r.params[prop];
    r = r.parent;
  }
  return '';
}
