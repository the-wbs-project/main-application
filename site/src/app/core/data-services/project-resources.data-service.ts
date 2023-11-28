import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RecordResource } from '../models';

export class ProjectResourcesDataService {
  constructor(private readonly http: HttpClient) {}

  getByProjectIdAsync(
    owner: string,
    projectId: string
  ): Observable<RecordResource[]> {
    return this.http
      .get<RecordResource[]>(
        `api/projects/owner/${owner}/id/${projectId}/resources`
      )
      .pipe(map((list) => this.cleanList(list)));
  }

  getByTaskIdAsync(
    owner: string,
    projectId: string,
    taskId: string
  ): Observable<RecordResource[]> {
    return this.http
      .get<RecordResource[]>(
        `api/projects/owner/${owner}/id/${projectId}/nodes/${taskId}/resources`
      )
      .pipe(map((list) => this.cleanList(list)));
  }

  putProjectAsync(
    ownerId: string,
    projectId: string,
    resource: RecordResource
  ): Observable<void> {
    return this.http.put<void>(
      `api/projects/owner/${ownerId}/id/${projectId}/resources/${resource.id}`,
      resource
    );
  }

  putTaskAsync(
    ownerId: string,
    projectId: string,
    taskId: string,
    resource: RecordResource
  ): Observable<void> {
    return this.http.put<void>(
      `api/projects/owner/${ownerId}/id/${projectId}/nodes/${taskId}/resources/${resource.id}`,
      resource
    );
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
