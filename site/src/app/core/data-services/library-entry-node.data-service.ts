import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LibraryEntryNode, ProjectNodeToLibraryOptions } from '../models';
import { Utils } from '../services';

export class LibraryEntryNodeDataService {
  constructor(private readonly http: HttpClient) {}

  getAllAsync(
    owner: string,
    entryId: string,
    version: number,
    visibility: string
  ): Observable<LibraryEntryNode[]> {
    return this.http
      .get<LibraryEntryNode[]>(
        `api/portfolio/${owner}/library/entries/${entryId}/versions/${version}/nodes/${visibility}`
      )
      .pipe(map((list) => this.clean(list)));
  }

  putAsync(
    owner: string,
    entryId: string,
    version: number,
    upserts: LibraryEntryNode[],
    removeIds: string[]
  ): Observable<void> {
    return this.http.put<void>(
      `api/portfolio/${owner}/library/entries/${entryId}/versions/${version}/nodes`,
      {
        upserts,
        removeIds,
      }
    );
  }

  exportAsync(
    owner: string,
    entryId: string,
    version: number,
    nodeId: string,
    model: ProjectNodeToLibraryOptions
  ): Observable<string> {
    return this.http.post<string>(
      `api/portfolio/${owner}/library/entries/${entryId}/versions/${version}/nodes/${nodeId}/export`,
      model
    );
  }

  private clean(nodes: LibraryEntryNode[]): LibraryEntryNode[] {
    Utils.cleanDates(nodes, 'createdOn', 'lastModified');

    return nodes;
  }
}
