import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { VerifyProject } from '../actions';

@Injectable()
export class ProjectVerifyGuard  {
  constructor(private readonly store: Store) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<true> {
    return this.store
      .dispatch(new VerifyProject(route.params['projectId']))
      .pipe(map(() => true));
  }
}
