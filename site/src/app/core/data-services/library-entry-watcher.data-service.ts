import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EntityId } from '../models';

export class LibraryEntryWatcherDataService {
  constructor(private readonly http: HttpClient) {}

  getEntriesAsync(): Observable<EntityId[]> {
    return this.http.get<EntityId[]>('api/watchers/entries');
  }

  getCountAsync(ownerId: string, entryId: string): Observable<number> {
    return this.http.get<number>(
      `api/watchers/users/${ownerId}/${entryId}/count`
    );
  }

  addAsync(
    ownerId: string,
    entryId: string,
    watcherId: string
  ): Observable<void> {
    return this.putAsync(ownerId, entryId, watcherId, 'add');
  }

  deleteAsync(
    ownerId: string,
    entryId: string,
    watcherId: string
  ): Observable<void> {
    return this.putAsync(ownerId, entryId, watcherId, 'delete');
  }

  private putAsync(
    ownerId: string,
    entryId: string,
    watcherId: string,
    action: string
  ): Observable<void> {
    return this.http.put<void>('api/watchers/library', {
      ownerId,
      entryId,
      watcherId,
      action,
    });
  }
}
