import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { first, map, skipWhile } from 'rxjs/operators';
import { EntryViewState } from '../states';

export const entryIdResolve: ResolveFn<string> = (
  route: ActivatedRouteSnapshot
) => {
  const projectId = route.params['entryId'];

  if (projectId) return projectId;
  return inject(Store)
    .select(EntryViewState)
    .pipe(
      skipWhile((x) => x == undefined),
      map((x) => x!.id),
      first()
    );
};
