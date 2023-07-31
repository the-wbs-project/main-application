import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { LoadPosts } from '@wbs/core/actions';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const threadLoadGuard = (route: ActivatedRouteSnapshot): Observable<boolean> => {
  const store = inject(Store);
 
  return store
    .dispatch(new LoadPosts(route.params['postId']))
    .pipe(map(() => true));
}
