import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectNode } from '../models';
import { Utils } from '../services';

export class ProjectNodeDataService {
  constructor(private readonly http: HttpClient) {}

  getAllAsync(owner: string, projectId: string): Observable<ProjectNode[]> {
    return this.http
      .get<ProjectNode[]>(`api/projects/owner/${owner}/id/${projectId}/nodes`)
      .pipe(map((list) => this.clean(list)));
  }

  putAsync(
    owner: string,
    projectId: string,
    upserts: ProjectNode[],
    removeIds: string[]
  ): Observable<void> {
    return this.http.put<void>(
      `api/projects/owner/${owner}/id/${projectId}/nodes`,
      {
        upserts,
        removeIds,
      }
    );
  }

  private clean(nodes: ProjectNode[]): ProjectNode[] {
    Utils.cleanDates(nodes, 'createdOn', 'lastModified');

    return nodes;
  }
}
