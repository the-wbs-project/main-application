import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store } from '@ngxs/store';
import { ProjectState } from '@wbs/components/projects/states';
import { LoadDiscussionForum } from '@wbs/core/actions';
import { AuthState } from '@wbs/core/states';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable()
export class ProjectDiscussionGuard implements CanActivate {
  constructor(private readonly store: Store) {}

  canActivate(): Observable<boolean> {
    return forkJoin({
      org: this.store.selectOnce(AuthState.organization),
      project: this.store.selectOnce(ProjectState.current),
    }).pipe(
      switchMap((data) =>
        this.store.dispatch(
          new LoadDiscussionForum(data.org!, data.project!.id)
        )
      ),
      map(() => true)
    );
  }
}
