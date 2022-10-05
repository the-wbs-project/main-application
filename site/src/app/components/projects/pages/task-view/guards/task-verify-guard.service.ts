import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { TimelineService } from '@wbs/shared/services';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { LoadTaskTimeline, VerifyProject } from '../../../actions';
import { VerifyTask } from '../task-view.actions';

@Injectable()
export class TaskVerifyGuard implements CanActivate {
  constructor(
    private readonly store: Store,
    private readonly timeline: TimelineService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    return this.store
      .dispatch([
        new VerifyTask(route.params['projectId'], route.params['taskId']),
        new LoadTaskTimeline(route.params['taskId']),
      ])
      .pipe(
        switchMap(() => this.timeline.verifyAsync()),
        map(() => true)
      );
  }
}
