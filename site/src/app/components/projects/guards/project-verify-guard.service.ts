import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { SetProject } from '@wbs/shared/actions';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { VerifyProject } from '../project.actions';

@Injectable()
export class ProjectVerifyGuard implements CanActivate {
  constructor(private readonly store: Store) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    const id = route.params['projectId'];
    return this.store
      .dispatch([new VerifyProject(id), new SetProject(id)])
      .pipe(map(() => true));
  }
}
