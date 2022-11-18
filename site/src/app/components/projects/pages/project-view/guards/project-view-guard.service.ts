import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Store } from '@ngxs/store';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectPageChanged } from '../actions';

@Injectable()
export class ProjectViewGuard implements CanActivate {
  constructor(private readonly store: Store) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const view = route.data['view'];

    return forkJoin([this.store.dispatch(new ProjectPageChanged(view))]).pipe(
      map(() => true)
    );
  }
}
