import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { VerifyProject } from '../actions';

@Injectable()
export class ProjectVerifyGuard implements CanActivate {
  constructor(private readonly store: Store) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<true> {
    const id = route.params['projectId'];
    console.log(route.params);
    return this.store.dispatch(new VerifyProject(id)).pipe(map(() => true));
  }
}
