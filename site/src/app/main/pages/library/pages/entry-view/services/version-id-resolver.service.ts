import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { first, map, skipWhile } from 'rxjs/operators';
import { EntryViewState } from '../states';

export const versionIdResolve: ResolveFn<number> = (
  route: ActivatedRouteSnapshot
) => {
  const versionId = parseInt(route.params['versionId']);

  if (versionId && !isNaN(versionId)) return versionId;
  return inject(Store)
    .select(EntryViewState.version)
    .pipe(
      skipWhile((x) => x == undefined),
      map((x) => x!.version),
      first()
    );
};
