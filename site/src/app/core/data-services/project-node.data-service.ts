import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectNode } from '../models';
import { Utils } from '../services';

export class ProjectNodeDataService {
  constructor(private readonly http: HttpClient) {}

  getAllAsync(owner: string, projectId: string): Observable<ProjectNode[]> {
    return this.http
      .get<ProjectNode[]>(`api/portfolio/${owner}/projects/${projectId}/nodes`)
      .pipe(map((list) => this.clean(list)));
  }

  putAsync(
    owner: string,
    projectId: string,
    upserts: ProjectNode[],
    removeIds: string[]
  ): Observable<void> {
    return this.http.put<void>(
      `api/portfolio/${owner}/projects/${projectId}/nodes`,
      {
        upserts,
        removeIds,
      }
    );
  }

  exportToLibraryAsync(
    owner: string,
    projectId: string,
    nodeId: string,
    author: string,
    title: string | undefined,
    description: string | null | undefined,
    includeResources: boolean,
    visibility: number
  ): Observable<string> {
    return this.http.post<string>(
      `api/portfolio/${owner}/projects/${projectId}/nodes/${nodeId}/export/libraryEntry`,
      {
        author,
        title,
        description,
        includeResources,
        visibility,
      }
    );
  }

  private clean(nodes: ProjectNode[]): ProjectNode[] {
    Utils.cleanDates(nodes, 'createdOn', 'lastModified');

    return nodes;
  }
}
