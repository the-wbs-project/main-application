import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { PROJECT_VIEW_TYPE } from '@wbs/models';
import { DataServiceFactory, Resources } from '@wbs/services';
import { forkJoin, Observable, of } from 'rxjs';
import { DragPage } from '../model';
import { DragBaseResolver } from './drag-base-resolver.service';

@Injectable()
export class DragProjectResolver
  extends DragBaseResolver
  implements Resolve<DragPage | null>
{
  constructor(data: DataServiceFactory, resources: Resources) {
    super(data, resources);
  }

  resolve(route: ActivatedRouteSnapshot): Observable<DragPage | null> {
    const projectId = route.paramMap.get('projectId');
    const view = <PROJECT_VIEW_TYPE>route.paramMap.get('view');

    if (!projectId || !view) return of(null);

    return forkJoin({
      resources: this.getResourcesAsync(),
      project: this.getProjectAsync(projectId),
      nodes: this.getNodesAsync(projectId, view),
    });
  }
}
