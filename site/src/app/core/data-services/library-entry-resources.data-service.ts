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
    return this.http
      .get<ResourceRecord[]>(this.getUrl(owner, entryId, entryVersion, taskId))
      .pipe(map((list) => this.cleanList(list)));
  }

  putAsync(
    owner: string,
    entryId: string,
    entryVersion: number,
    taskId: string | undefined,
    resource: ResourceRecord
  ): Observable<void> {
    return this.http.put<void>(
      this.getIdUrl(resource.id, owner, entryId, entryVersion, taskId),
      resource
    );
  }

  putFileAsync(
    owner: string,
    entryId: string,
    entryVersion: number,
    taskId: string | undefined,
    resourceId: string,
    file: ArrayBuffer
  ): Observable<void> {
    const formData = new FormData();

    formData.append('file', new Blob([file]));

    return this.http.put<void>(
      this.getIdUrl(resourceId, owner, entryId, entryVersion, taskId) + '/file',
      formData
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

  private getUrl(
    owner: string,
    entryId: string,
    entryVersion: number,
    taskId?: string
  ): string {
    let url = `api/portfolio/${owner}/library/entries/${entryId}/versions/${entryVersion}`;

    if (taskId) url += `/nodes/${taskId}`;

    return url + '/resources';
  }

  private getIdUrl(
    resourceId: string,
    owner: string,
    entryId: string,
    entryVersion: number,
    taskId?: string
  ): string {
    return `${this.getUrl(owner, entryId, entryVersion, taskId)}/${resourceId}`;
  }
}
