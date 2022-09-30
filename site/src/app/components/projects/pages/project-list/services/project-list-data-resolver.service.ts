import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Store } from '@ngxs/store';
import { Project } from '@wbs/shared/models';
import { ProjectService } from '@wbs/shared/services';
import { ProjectListState } from '@wbs/shared/states';
import { map, Observable } from 'rxjs';

@Injectable()
export class ProjectListDataResolver implements Resolve<Project[]> {
  constructor(
    private readonly service: ProjectService,
    private readonly store: Store
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Project[]> {
    const type = route.paramMap.get('type') ?? '';
    const status = route.paramMap.get('status') ?? '';
    const projects =
      type === 'my' ? ProjectListState.list : ProjectListState.watched;

    return this.store
      .selectOnce(projects)
      .pipe(map((list) => this.service.filter(list, status)));
  }
}
