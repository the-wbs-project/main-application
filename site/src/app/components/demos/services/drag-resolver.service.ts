import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import {
  Project,
  PROJECT_VIEW,
  PROJECT_VIEW_TYPE,
  WbsNodeView,
} from '@wbs/models';
import { DataServiceFactory, Resources } from '@wbs/services';
import { forkJoin, Observable, of, tap } from 'rxjs';

@Injectable()
export class DragResolver
  implements Resolve<{ project: Project; nodes: WbsNodeView[] | null } | null>
{
  constructor(
    private readonly data: DataServiceFactory,
    private readonly resources: Resources
  ) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<{ project: Project; nodes: WbsNodeView[] | null } | null> {
    const owner = route.paramMap.get('owner');
    const projectId = route.paramMap.get('projectId');
    const view = <PROJECT_VIEW_TYPE>route.paramMap.get('view');

    if (!owner || !projectId || !view) return of(null);

    return forkJoin({
      resources: this.data.resources.getAsync('Wbs'),
      project: this.data.project.getAsync(owner, projectId),
      nodes:
        view === PROJECT_VIEW.DISCIPLINE
          ? this.data.wbs.getDisciplineList(owner, projectId)
          : this.data.wbs.getPhaseList(owner, projectId),
    }).pipe(tap((x) => this.resources.append(x.resources)));
  }
}
