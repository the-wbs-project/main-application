import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Utils } from '@wbs/core/services';
import { Observable } from 'rxjs';
import { EntryService } from '../../../../../core/services/library/entry.service';

export const libraryClaimsResolve: ResolveFn<string[]> = (
  route: ActivatedRouteSnapshot
) => getLibraryClaims(inject(DataServiceFactory), route);

export const ownerIdResolve: ResolveFn<string> = (
  route: ActivatedRouteSnapshot
) => Utils.getParam(route, 'ownerId');

export const entryIdResolve: ResolveFn<string> = (
  route: ActivatedRouteSnapshot
) => Utils.getParam(route, 'entryId');

export const versionIdResolve: ResolveFn<number> = (
  route: ActivatedRouteSnapshot
) => parseInt(Utils.getParam(route, 'versionId'));

export const taskIdResolve: ResolveFn<string> = (
  route: ActivatedRouteSnapshot
) => Utils.getParam(route, 'taskId');

export const entryUrlResolve: ResolveFn<string[]> = (
  route: ActivatedRouteSnapshot
) => EntryService.getEntryUrl(route);

function getLibraryClaims(
  data: DataServiceFactory,
  route: ActivatedRouteSnapshot
): Observable<string[]> {
  return data.claims.getLibraryEntryClaimsAsync(
    Utils.getParam(route, 'ownerId'),
    Utils.getParam(route, 'entryId')
  );
}
