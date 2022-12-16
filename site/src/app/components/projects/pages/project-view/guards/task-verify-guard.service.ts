import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { VerifyTimelineData } from '@wbs/core/actions';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoadTaskTimeline } from '../../../actions';
import { VerifyTask } from '../../project-view/actions';
import { ProjectViewState } from '../states';

@Injectable()
export class TaskVerifyGuard implements CanActivate {
  constructor(private readonly store: Store) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    return this.store
      .dispatch([
        new VerifyTask(
          route.params['projectId'],
          this.store.selectSnapshot(ProjectViewState.viewNode)!,
          route.params['taskId']
        ),
        new LoadTaskTimeline(route.params['taskId']),
      ])
      .pipe(map(() => true));
  }
}
