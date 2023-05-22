import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PROJECT_PAGE_VIEW } from '../models';

@Injectable()
export class ProjectRedirectGuard {
  constructor(private readonly store: Store) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    return this.store
      .dispatch(
        new Navigate([
          'projects',
          'view',
          route.params['projectId'],
          PROJECT_PAGE_VIEW.ABOUT,
        ])
      )
      .pipe(map(() => true));
  }
}
