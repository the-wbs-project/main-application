import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PAGE_VIEW } from '../models';

@Injectable()
export class TaskRedirectGuard implements CanActivate {
  constructor(private readonly store: Store) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    return this.store
      .dispatch(
        new Navigate([
          'projects',
          route.params['projectId'],
          'task',
          route.params['taskId'],
          PAGE_VIEW.ABOUT,
        ])
      )
      .pipe(map(() => true));
  }
}
