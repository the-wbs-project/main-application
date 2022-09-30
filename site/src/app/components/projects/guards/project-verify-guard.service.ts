import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { LoadTimeline } from '@wbs/shared/actions';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { VerifyProject } from '../project.actions';

@Injectable()
export class ProjectVerifyGuard implements CanActivate {
  constructor(private readonly store: Store) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    const id = route.params['projectId'];
    return this.store
      .dispatch([new VerifyProject(id), new LoadTimeline(id)])
      .pipe(map(() => true));
  }
}
