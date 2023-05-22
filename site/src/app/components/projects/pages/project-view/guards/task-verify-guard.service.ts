import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoadTaskTimeline, VerifyTask } from '../actions';
import { ProjectViewState } from '../states';

@Injectable()
export class TaskVerifyGuard {
  constructor(private readonly store: Store) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    const viewNode = this.store.selectSnapshot(ProjectViewState.viewNode)!;
    const taskId = route.params['taskId'];

    if (!taskId) return false;

    return this.store
      .dispatch([
        new VerifyTask(viewNode, taskId),
        new LoadTaskTimeline(taskId),
      ])
      .pipe(map(() => true));
  }
}
