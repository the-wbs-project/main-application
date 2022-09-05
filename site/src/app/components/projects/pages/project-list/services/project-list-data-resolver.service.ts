import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Store } from '@ngxs/store';
import { Project, PROJECT_STATI, PROJECT_VIEW_STATI } from '@wbs/shared/models';
import { ProjectListState } from '@wbs/shared/states';
import { map, Observable } from 'rxjs';

@Injectable()
export class ProjectListDataResolver implements Resolve<Project[]> {
  constructor(private readonly store: Store) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Project[]> {
    const type = route.paramMap.get('type') ?? '';
    const status = route.paramMap.get('status') ?? '';
    const projects =
      type === 'my' ? ProjectListState.list : ProjectListState.watched;

    return this.store.selectOnce(projects).pipe(
      map((list) => {
        if (status === PROJECT_VIEW_STATI.ACTIVE)
          return list.filter((x) => x.status !== PROJECT_STATI.CLOSED);

        return list.filter((x) => x.status === status);
      })
    );
  }
}
