import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResourceRecord } from '../models';

export class ProjectResourcesDataService {
  constructor(private readonly http: HttpClient) {}

  getAsync(
    owner: string,
    projectId: string,
    taskId?: string
  ): Observable<ResourceRecord[]> {
    const url = taskId
      ? `api/portfolio/${owner}/projects/${projectId}/nodes/${taskId}/resources`
      : `api/portfolio/${owner}/projects/${projectId}/resources`;

    return this.http
      .get<ResourceRecord[]>(url)
      .pipe(map((list) => this.cleanList(list)));
  }

  putAsync(
    ownerId: string,
    projectId: string,
    taskId: string | undefined,
    resource: ResourceRecord
  ): Observable<void> {
    const url = taskId
      ? `api/portfolio/${ownerId}/projects/${projectId}/nodes/${taskId}/resources/${resource.id}`
      : `api/portfolio/${ownerId}/projects/${projectId}/resources/${resource.id}`;

    return this.http.put<void>(url, resource);
  }

  private cleanList(nodes: ResourceRecord[]): ResourceRecord[] {
    for (const node of nodes) {
      if (typeof node.createdOn === 'string')
        node.createdOn = new Date(node.createdOn);

      if (typeof node.lastModified === 'string')
        node.lastModified = new Date(node.lastModified);
    }
    return nodes;
  }
}