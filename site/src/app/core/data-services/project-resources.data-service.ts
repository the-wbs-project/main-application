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
    return this.http
      .get<ResourceRecord[]>(this.getUrl(owner, projectId, taskId))
      .pipe(map((list) => this.cleanList(list)));
  }

  putAsync(
    owner: string,
    projectId: string,
    taskId: string | undefined,
    resource: ResourceRecord
  ): Observable<void> {
    return this.http.put<void>(
      this.getIdUrl(resource.id, owner, projectId, taskId),
      resource
    );
  }

  putFileAsync(
    owner: string,
    projectId: string,
    taskId: string | undefined,
    resourceId: string,
    file: ArrayBuffer
  ): Observable<void> {
    return this.http.put<void>(
      this.getIdUrl(resourceId, owner, projectId, taskId) + '/blob',
      file
    );
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

  private getUrl(owner: string, projectId: string, taskId?: string): string {
    let url = `api/portfolio/${owner}/projects/${projectId}`;

    if (taskId) url += `/nodes/${taskId}`;

    return url + '/resources';
  }

  private getIdUrl(
    resourceId: string,
    owner: string,
    projectId: string,
    taskId?: string
  ): string {
    return `${this.getUrl(owner, projectId, taskId)}/${resourceId}`;
  }
}
