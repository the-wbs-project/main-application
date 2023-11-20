import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { first, map, skipWhile } from 'rxjs';
import { ProjectState } from '../states';

export const projectIdResolve: ResolveFn<string> = (
  route: ActivatedRouteSnapshot
) => {
  const projectId = route.params['projectId'];

  if (projectId) return projectId;
  return inject(Store)
    .select(ProjectState.current)
    .pipe(
      skipWhile((x) => x == undefined),
      map((x) => x!.id),
      first()
    );
};
