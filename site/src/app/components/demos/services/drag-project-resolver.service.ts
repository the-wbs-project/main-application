import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Store } from '@ngxs/store';
import { PROJECT_VIEW_TYPE } from '@wbs/models';
import { DataServiceFactory, Resources, Transformers } from '@wbs/services';
import { forkJoin, Observable, of, switchMap } from 'rxjs';
import { DragPage } from '../model';
import { DragBaseResolver } from './drag-base-resolver.service';

@Injectable()
export class DragProjectResolver
  extends DragBaseResolver
  implements Resolve<DragPage | null>
{
  constructor(
    data: DataServiceFactory,
    resources: Resources,
    store: Store,
    transformers: Transformers
  ) {
    super(data, resources, store, transformers);
  }

  resolve(route: ActivatedRouteSnapshot): Observable<DragPage | null> {
    const projectId = route.paramMap.get('projectId');
    const view = <PROJECT_VIEW_TYPE>route.paramMap.get('view');

    if (!projectId || !view) return of(null);

    return this.getProjectAsync(projectId).pipe(
      switchMap((project) =>
        forkJoin({
          resources: this.getResourcesAsync(),
          deleteReasons: this.getDeleteListAsync(),
          project: of(project),
          nodes: this.getNodesAsync(project, view),
        })
      )
    );
  }
}
