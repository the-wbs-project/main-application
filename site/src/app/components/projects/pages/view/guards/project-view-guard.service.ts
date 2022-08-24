import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { Resources } from '@wbs/shared/services';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PROJECT_VIEW } from '../models/project-view.enum';
import {
  ProjectViewChanged,
  VerifyDeleteReasons,
} from '../project-view.actions';

@Injectable()
export class ProjectViewGuard implements CanActivate {
  constructor(
    private readonly resources: Resources,
    private readonly store: Store
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    const view = route.params['view'];

    if (view)
      return forkJoin([
        this.resources.verifyAsync('Wbs'),
        this.resources.verifyAsync('Projects'),
        this.store.dispatch(new VerifyDeleteReasons()),
        this.store.dispatch(new ProjectViewChanged(view)),
      ]).pipe(map(() => true));

    return this.store.dispatch(
      new Navigate([
        'projects',
        'view',
        route.params['projectId'],
        PROJECT_VIEW.GENERAL,
      ])
    );
  }
}
