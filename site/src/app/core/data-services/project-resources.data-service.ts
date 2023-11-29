import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RecordResource } from '../models';

export class ProjectResourcesDataService {
  constructor(private readonly http: HttpClient) {}

  getAsync(
    owner: string,
    projectId: string,
    taskId?: string
  ): Observable<RecordResource[]> {
    const url = taskId
      ? `api/projects/owner/${owner}/id/${projectId}/nodes/${taskId}/resources`
      : `api/projects/owner/${owner}/id/${projectId}/resources`;

    return this.http
      .get<RecordResource[]>(url)
      .pipe(map((list) => this.cleanList(list)));
  }

  putAsync(
    ownerId: string,
    projectId: string,
    taskId: string | undefined,
    resource: RecordResource
  ): Observable<void> {
    const url = taskId
      ? `api/projects/owner/${ownerId}/id/${projectId}/nodes/${taskId}/resources/${resource.id}`
      : `api/projects/owner/${ownerId}/id/${projectId}/resources/${resource.id}`;

    return this.http.put<void>(url, resource);
  }

  private cleanList(nodes: RecordResource[]): RecordResource[] {
    for (const node of nodes) {
      if (typeof node.createdOn === 'string')
        node.createdOn = new Date(node.createdOn);

      if (typeof node.lastModified === 'string')
        node.lastModified = new Date(node.lastModified);
    }
    return nodes;
  }
}
