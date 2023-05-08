import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskPageChanged } from '../../project-view/actions';

@Injectable()
export class TaskViewGuard  {
  constructor(private readonly store: Store) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    const view = route.data['view'];

    return this.store.dispatch(new TaskPageChanged(view)).pipe(map(() => true));
  }
}
