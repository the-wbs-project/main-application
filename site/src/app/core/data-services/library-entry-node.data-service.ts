import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LibraryEntryNode } from '../models';
import { Utils } from '../services';

export class LibraryEntryNodeDataService {
  constructor(private readonly http: HttpClient) {}

  getAllAsync(
    owner: string,
    entryId: string,
    version: number
  ): Observable<LibraryEntryNode[]> {
    return this.http
      .get<LibraryEntryNode[]>(
        `api/portfolio/${owner}/library/entries/${entryId}/versions/${version}/nodes`
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

  private clean(nodes: LibraryEntryNode[]): LibraryEntryNode[] {
    Utils.cleanDates(nodes, 'createdOn', 'lastModified');

    return nodes;
  }
}
