import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LibraryEntryVersion } from '../models';
import { Utils } from '../services';

export class LibraryEntryVersionDataService {
  constructor(private readonly http: HttpClient) {}

  getAllAsync(
    owner: string,
    entryId: string
  ): Observable<LibraryEntryVersion[]> {
    return this.http
      .get<LibraryEntryVersion[]>(
        `api/portfolio/${owner}/library/entries/${entryId}/versions`
      )
      .pipe(map((list) => this.clean(list)));
  }

  getAsync(
    owner: string,
    entryId: string,
    entryVersion: number
  ): Observable<LibraryEntryVersion> {
    return this.http
      .get<LibraryEntryVersion>(
        `api/portfolio/${owner}/library/entries/${entryId}/versions/${entryVersion}`
      )
      .pipe(map((list) => this.clean(list)));
  }

  putAsync(owner: string, entryVersion: LibraryEntryVersion): Observable<void> {
    return this.http.put<void>(
      `api/portfolio/${owner}/library/entries/${entryVersion.entryId}/versions/${entryVersion.version}`,
      entryVersion
    );
  }

  private clean<T extends LibraryEntryVersion | LibraryEntryVersion[]>(
    obj: T
  ): T {
    Utils.cleanDates(obj, 'lastModified');

    return obj;
  }
}
