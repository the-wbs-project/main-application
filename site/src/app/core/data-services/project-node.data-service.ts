import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectNode, WbsNode } from '../models';

export class ProjectNodeDataService {
  constructor(private readonly http: HttpClient) {}

  getAllAsync(
    organization: string,
    projectId: string
  ): Observable<ProjectNode[]> {
    return this.http
      .get<ProjectNode[]>(
        `api/projects/owner/${organization}/id/${projectId}/nodes`
      )
      .pipe(map((list) => this.cleanList(list)));
  }

  putAsync(
    organization: string,
    projectId: string,
    upserts: ProjectNode[],
    removeIds: string[]
  ): Observable<void> {
    return this.http.put<void>(
      `api/projects/owner/${organization}/id/${projectId}/nodes`,
      {
        upserts,
        removeIds,
      }
    );
  }

  private cleanList(nodes: ProjectNode[]): ProjectNode[] {
    for (const node of nodes) this.clean(node);

    return nodes;
  }

  private clean(node: ProjectNode): ProjectNode {
    if (typeof node.createdOn === 'string')
      node.createdOn = new Date(node.createdOn);

    if (typeof node.lastModified === 'string')
      node.lastModified = new Date(node.lastModified);

    return node;
  }
}
