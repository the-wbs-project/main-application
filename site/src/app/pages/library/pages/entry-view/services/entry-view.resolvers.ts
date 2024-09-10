import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Utils } from '@wbs/core/services';
import { LibraryService } from './library.service';

export const ownerIdResolve: ResolveFn<string> = (
  route: ActivatedRouteSnapshot
) => Utils.getParam(route, 'ownerId');

export const entryUrlResolve: ResolveFn<string[]> = (
  route: ActivatedRouteSnapshot
) => LibraryService.getEntryUrl(route);
