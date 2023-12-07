import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LibraryEntry } from '../models';
import { Utils } from '../services';

export class LibraryEntryDataService {
  constructor(private readonly http: HttpClient) {}

  getAllAsync(owner: string): Observable<LibraryEntry[]> {
    return this.http
      .get<LibraryEntry[]>(`api/library/owner/${owner}/entries`)
      .pipe(map((list) => this.clean(list)));
  }

  getAsync(owner: string, entryId: string): Observable<LibraryEntry> {
    return this.http
      .get<LibraryEntry>(`api/library/owner/${owner}/entries/${entryId}`)
      .pipe(map((node) => this.clean(node)));
  }

  putAsync(entry: LibraryEntry): Observable<void> {
    return this.http.put<void>(
      `api/library/owner/${entry.owner}/entries/${entry.id}`,
      entry
    );
  }

  private clean<T extends LibraryEntry | LibraryEntry[]>(obj: T): T {
    Utils.cleanDates(obj, 'lastModified');

    return obj;
  }
}
