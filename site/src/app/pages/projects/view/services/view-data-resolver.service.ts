import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { PROJECT_STATI } from '@app/models';
import { ProjectState } from '@app/states';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectsViewModel } from '../view-models';

@Injectable()
export class ViewDataResolver implements Resolve<ProjectsViewModel> {
  constructor(private readonly store: Store) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ProjectsViewModel> {
    const listType = route.params['listType'];
    const filter = route.params['filter'];
    const selector =
      listType === 'my' ? ProjectState.list : ProjectState.watched;

    return this.store.selectOnce(selector).pipe(
      map((projects) => {
        return {
          projects,
          title:
            listType === 'my' ? 'Pages.MyProjects' : 'Pages.WatchedProjects',
          filters:
            filter !== 'all'
              ? [filter]
              : [
                  PROJECT_STATI.PLANNING,
                  PROJECT_STATI.EXECUTION,
                  PROJECT_STATI.FOLLOW_UP,
                  PROJECT_STATI.CLOSED,
                ],
        };
      })
    );
  }
}
