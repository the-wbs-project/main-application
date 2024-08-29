import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Utils } from '@wbs/core/services';
import { EntryService } from '@wbs/core/services/library';

export const ownerIdResolve: ResolveFn<string> = (
  route: ActivatedRouteSnapshot
) => Utils.getParam(route, 'ownerId');

export const entryUrlResolve: ResolveFn<string[]> = (
  route: ActivatedRouteSnapshot
) => EntryService.getEntryUrl(route);
