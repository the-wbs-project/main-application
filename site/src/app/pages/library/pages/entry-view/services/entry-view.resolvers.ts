import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { LibraryService } from './library.service';

export const entryUrlResolve: ResolveFn<string[]> = (
  route: ActivatedRouteSnapshot
) => LibraryService.getEntryUrl(route);
