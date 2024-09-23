import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContentResource } from '../models';

export class ContentResourcesDataService {
  constructor(private readonly http: HttpClient) {}

  getAsync(owner: string, parentId: string): Observable<ContentResource[]> {
    return this.http
      .get<ContentResource[]>(this.getUrl(owner, parentId))
      .pipe(map((list) => this.cleanList(list)));
  }

  getFileUrl(owner: string, parentId: string, resourceId: string): string {
    return this.getUrl(owner, parentId, resourceId, 'file');
  }

  getFileAsync(
    owner: string,
    parentId: string,
    resourceId: string
  ): Observable<ArrayBuffer> {
    return this.http.get(this.getFileUrl(owner, parentId, resourceId), {
      responseType: 'arraybuffer',
    });
  }

  putAsync(resource: ContentResource): Observable<void> {
    return this.http.put<void>(
      this.getUrl(resource.ownerId, resource.parentId, resource.id),
      resource
    );
  }

  putFileAsync(
    owner: string,
    parentId: string,
    resourceId: string,
    file: ArrayBuffer
  ): Observable<void> {
    return this.http.put<void>(
      this.getUrl(owner, parentId, resourceId, 'file'),
      file
    );
  }

  deleteAsync(
    owner: string,
    parentId: string,
    resourceId: string
  ): Observable<void> {
    return this.http.delete<void>(this.getUrl(owner, parentId, resourceId));
  }

  private cleanList(nodes: ContentResource[]): ContentResource[] {
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
    parentId: string,
    resourceId?: string,
    suffix?: string
  ): string {
    let url = ['api', 'portfolio', owner, 'content-resources', parentId];

    if (resourceId) url.push('resource', resourceId);
    if (suffix) url.push(suffix);

    return url.join('/');
  }
}
