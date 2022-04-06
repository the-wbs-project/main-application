import { Injectable } from '@angular/core';
import {
  Project,
  PROJECT_VIEW,
  PROJECT_VIEW_TYPE,
  ResourceSections,
  WbsNodeView,
} from '@wbs/models';
import { DataServiceFactory, Resources } from '@wbs/services';
import { Observable, of, tap } from 'rxjs';

@Injectable()
export class DragBaseResolver {
  constructor(
    private readonly data: DataServiceFactory,
    private readonly resources: Resources
  ) {}

  getResourcesAsync(existing?: ResourceSections): Observable<ResourceSections> {
    if (existing) return of(existing);

    return this.data.resources
      .getAsync('Wbs')
      .pipe(tap((x) => this.resources.append(x)));
  }

  getProjectAsync(projectId: string, existing?: Project): Observable<Project> {
    if (existing) return of(existing);

    return this.data.project.getAsync(projectId);
  }

  getNodesAsync(
    projectId: string,
    view: PROJECT_VIEW_TYPE,
    existing?: WbsNodeView[]
  ): Observable<WbsNodeView[]> {
    if (existing) return of(existing);

    return view === PROJECT_VIEW.DISCIPLINE
      ? this.data.wbs.getDisciplineList(projectId)
      : this.data.wbs.getPhaseList(projectId);
  }
}
