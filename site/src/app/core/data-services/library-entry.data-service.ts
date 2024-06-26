import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LibraryEntry, LibrarySearchFilters } from '../models';
import { Utils } from '../services';
import { LibraryEntryViewModel } from '../view-models';

export class LibraryEntryDataService {
  constructor(private readonly http: HttpClient) {}

  searchAsync(
    owner: string,
    options: LibrarySearchFilters
  ): Observable<LibraryEntryViewModel[]> {
    return this.http
      .post<{ document: LibraryEntryViewModel }[]>(
        this.url(owner) + '/search',
        options
      )
      .pipe(
        map((list) => list.map((x) => x.document)),
        map((list) => this.clean(list))
      );
  }

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

  private clean<T extends LibraryEntryViewModel | LibraryEntryViewModel[]>(
    obj: T
  ): T {
    Utils.cleanDates(obj, 'lastModified');

    return obj;
  }
}
