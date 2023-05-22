import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { LoadDiscussionForum } from '@wbs/core/actions';
import { AuthState } from '@wbs/core/states';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ProjectState } from '../states';

@Injectable()
export class ProjectDiscussionGuard {
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
