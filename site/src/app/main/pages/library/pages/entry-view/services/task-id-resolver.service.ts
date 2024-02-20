import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { first, map, skipWhile } from 'rxjs/operators';
import { EntryViewState } from '../states';

export const taskIdResolve: ResolveFn<number> = (
  route: ActivatedRouteSnapshot
) =>
  route.params['taskId'] ??
  inject(Store)
    .select(EntryViewState.task)
    .pipe(
      skipWhile((x) => x == undefined),
      map((x) => x!.id),
      first()
    );
