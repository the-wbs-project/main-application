import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { VerifyTask } from '../task-view.actions';

@Injectable()
export class TaskVerifyGuard implements CanActivate {
  constructor(private readonly store: Store) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    return this.store
      .dispatch(
        new VerifyTask(route.params['projectId'], route.params['taskId'])
      )
      .pipe(map(() => true));
  }
}
