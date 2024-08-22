import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { APP_CONFIG_TOKEN } from '@wbs/core/models';
import { Utils } from '@wbs/core/services';
import { EntryService } from '@wbs/core/services/library';

export const ownerIdResolve: ResolveFn<string> = (
  route: ActivatedRouteSnapshot
) => Utils.getParam(route, 'ownerId');

export const entryIdResolve: ResolveFn<string> = (
  route: ActivatedRouteSnapshot
) => Utils.getParam(route, 'entryId');

export const versionIdResolve: ResolveFn<number> = (
  route: ActivatedRouteSnapshot
) => parseInt(Utils.getParam(route, 'versionId'));

export const entryUrlResolve: ResolveFn<string[]> = (
  route: ActivatedRouteSnapshot
) => EntryService.getEntryUrl(route);

export const entryApiUrlResolve: ResolveFn<string> = (
  route: ActivatedRouteSnapshot
) => EntryService.getEntryApiUrl(inject(APP_CONFIG_TOKEN), route);
