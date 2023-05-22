import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SetAsStarted, SetPageTitle } from '../actions';
import { ProjectUploadState } from '../states';

@Injectable()
export class ProjectUploadGuard {
  constructor(private readonly store: Store) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | Observable<boolean> {
    const title = route.data['title'];
    const validateStart = route.data['validateStart'] === true;
    const setStart = route.data['setStart'] === true;

    if (validateStart) {
      const started = this.store.selectSnapshot(ProjectUploadState.started);

      if (!started) {
        const projectId = this.store.selectSnapshot(
          ProjectUploadState.current
        )!.id;
        return this.store
          .dispatch(new Navigate(['/projects', projectId, 'upload', 'start']))
          .pipe(map(() => false));
      }
    }
    const dispatch: any[] = [new SetPageTitle(title)];

    if (setStart) dispatch.push(new SetAsStarted());

    return this.store.dispatch(dispatch).pipe(map(() => true));
  }
}
