import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class StartGuard implements CanActivate {
  constructor(private readonly store: Store) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<true> {
    return this.store
      .dispatch(
        new Navigate([
          '/projects',
          route.params['projectId'],
          'upload',
          'start',
        ])
      )
      .pipe(map(() => true));
  }
}
