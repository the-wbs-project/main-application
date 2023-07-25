import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { VerifyTimelineData } from '@wbs/core/actions';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoadProjectTimeline } from '../actions';

@Injectable()
export class ProjectTimelineVerifyGuard  {
  constructor(private readonly store: Store) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    const id = route.params['projectId'];
    return this.store
      .dispatch([new VerifyTimelineData(), new LoadProjectTimeline(id)])
      .pipe(map(() => true));
  }
}
