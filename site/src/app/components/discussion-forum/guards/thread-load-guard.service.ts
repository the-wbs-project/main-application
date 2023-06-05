import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { LoadPosts } from '@wbs/core/actions';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ThreadLoadGuard  {
  constructor(private readonly store: Store) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<true> {
    return this.store
      .dispatch(new LoadPosts(route.params['postId']))
      .pipe(map(() => true));
  }
}