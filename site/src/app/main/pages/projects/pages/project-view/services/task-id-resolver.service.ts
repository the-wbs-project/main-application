import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { first, map, skipWhile } from 'rxjs';
import { TasksState } from '../states';

export const taskIdResolve: ResolveFn<string> = (
  route: ActivatedRouteSnapshot
) => {
  const projectId = route.params['taskId'];

  if (projectId) return projectId;
  return inject(Store)
    .select(TasksState.current)
    .pipe(
      skipWhile((x) => x == undefined),
      map((x) => x!.id),
      first()
    );
};
