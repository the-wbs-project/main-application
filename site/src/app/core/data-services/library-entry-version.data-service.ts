import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LibraryEntryVersion } from '../models';

export class LibraryEntryVersionDataService {
  constructor(private readonly http: HttpClient) {}

  getAllAsync(
    owner: string,
    entryId: string
  ): Observable<LibraryEntryVersion[]> {
    return this.http.get<LibraryEntryVersion[]>(
      `api/portfolio/${owner}/library/entries/${entryId}/versions`
    );
  }

  getAsync(
    owner: string,
    entryId: string,
    entryVersion: number
  ): Observable<LibraryEntryVersion> {
    return this.http.get<LibraryEntryVersion>(
      `api/portfolio/${owner}/library/entries/${entryId}/versions/${entryVersion}`
    );
  }

  putAsync(owner: string, entryVersion: LibraryEntryVersion): Observable<void> {
    return this.http.put<void>(
      `api/portfolio/${owner}/library/entries/${entryVersion.entryId}/versions/${entryVersion.version}`,
      entryVersion
    );
  }
}
