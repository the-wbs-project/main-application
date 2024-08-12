import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LibraryEntry } from '../models';

export class LibraryEntryDataService {
  constructor(private readonly http: HttpClient) {}

  getAsync(owner: string, entryId: string): Observable<LibraryEntry> {
    return this.http.get<LibraryEntry>(this.url(owner, entryId));
  }

  putAsync(entry: LibraryEntry): Observable<void> {
    return this.http.put<void>(this.url(entry.owner, entry.id), entry);
  }

  private url(owner: string, entryId?: string): string {
    if (entryId) return `api/portfolio/${owner}/library/entries/${entryId}`;

    return `api/portfolio/${owner}/library/entries`;
  }
}
