import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { DataServiceFactory } from '@wbs/core/data-services';
import { APP_CONFIG_TOKEN } from '@wbs/core/models';
import { Utils } from '@wbs/core/services';
import { EntryService } from '@wbs/core/services/library';
import { Observable } from 'rxjs';

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

export const entryApiUrlResolve: ResolveFn<string> = (
  route: ActivatedRouteSnapshot
) => EntryService.getEntryApiUrl(inject(APP_CONFIG_TOKEN), route);

export const taskApiUrlResolve: ResolveFn<string> = (
  route: ActivatedRouteSnapshot
) => EntryService.getTaskApiUrl(inject(APP_CONFIG_TOKEN), route);

function getLibraryClaims(
  data: DataServiceFactory,
  route: ActivatedRouteSnapshot
): Observable<string[]> {
  return data.claims.getLibraryEntryClaimsAsync(
    Utils.getParam(route, 'ownerId'),
    Utils.getParam(route, 'entryId')
  );
}
