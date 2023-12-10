import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResourceRecord } from '../models';

export class LibraryEntryResourcesDataService {
  constructor(private readonly http: HttpClient) {}

  getAsync(
    owner: string,
    entryId: string,
    entryVersion: number,
    taskId?: string
  ): Observable<ResourceRecord[]> {
    const url = taskId
      ? `api/portfolio/${owner}/library/entries/${entryId}/versions/${entryVersion}/nodes/${taskId}/resources`
      : `api/portfolio/${owner}/library/entries/${entryId}/versions/${entryVersion}/resources`;

    return this.http
      .get<ResourceRecord[]>(url)
      .pipe(map((list) => this.cleanList(list)));
  }

  putAsync(
    owner: string,
    entryId: string,
    entryVersion: number,
    taskId: string | undefined,
    resource: ResourceRecord
  ): Observable<void> {
    const url = taskId
      ? `api/portfolio/${owner}/library/entries/${entryId}/versions/${entryVersion}/nodes/${taskId}/resources/${resource.id}`
      : `api/portfolio/${owner}/library/entries/${entryId}/versions/${entryVersion}/resources/${resource.id}`;

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
