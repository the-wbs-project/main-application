import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Store } from '@ngxs/store';
import { Resources } from '@wbs/shared/services';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskPageChanged } from '../task-view.actions';

@Injectable()
export class TaskViewGuard implements CanActivate {
  constructor(
    private readonly resources: Resources,
    private readonly store: Store
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    const view = route.params['view'];

    return forkJoin([
      this.resources.verifyAsync('Wbs'),
      this.resources.verifyAsync('Projects'),
      this.store.dispatch(new TaskPageChanged(view)),
    ]).pipe(map(() => true));
  }
}
