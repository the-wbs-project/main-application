import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LibraryEntry } from '../models';

export class LibraryEntryDataService {
  constructor(private readonly http: HttpClient) {}

  getIdAsync(owner: string, recordId: string): Observable<string> {
    return this.http.get<string>(this.url(owner, recordId) + '/id');
  }

  putAsync(entry: LibraryEntry): Observable<LibraryEntry> {
    return this.http.put<LibraryEntry>(
      this.url(entry.ownerId, entry.id),
      entry
    );
  }

  private url(owner: string, entryId?: string): string {
    if (entryId) return `api/portfolio/${owner}/library/entries/${entryId}`;

    return `api/portfolio/${owner}/library/entries`;
  }
}
