import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { VerifyProject } from '@wbs/components/projects/project.actions';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { VerifyTask } from '../task-view.actions';

@Injectable()
export class TaskVerifyGuard implements CanActivate {
  constructor(private readonly store: Store) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    return this.store
      .dispatch(new VerifyProject(route.params['projectId']))
      .pipe(
        switchMap(() =>
          this.store.dispatch(
            new VerifyTask(route.params['projectId'], route.params['taskId'])
          )
        ),
        map(() => true)
      );
  }
}
