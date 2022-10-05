import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { TimelineService } from '@wbs/shared/services';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { LoadProjectTimeline, VerifyProject } from '../actions';

@Injectable()
export class ProjectVerifyGuard implements CanActivate {
  constructor(
    private readonly store: Store,
    private readonly timeline: TimelineService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    const id = route.params['projectId'];
    return this.store
      .dispatch([new VerifyProject(id), new LoadProjectTimeline(id)])
      .pipe(
        switchMap(() => this.timeline.verifyAsync()),
        map(() => true)
      );
  }
}
