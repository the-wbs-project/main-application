import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LibraryEntryVersion, LibraryEntryVersionBasic } from '../models';
import { Utils } from '../services';
import { LibraryVersionViewModel } from '../view-models';

export class LibraryEntryVersionDataService {
  constructor(private readonly http: HttpClient) {}

  getAsync(
    owner: string,
    entryId: string
  ): Observable<LibraryEntryVersionBasic[]> {
    return this.http.get<LibraryEntryVersionBasic[]>(
      `api/portfolio/${owner}/library/entries/${entryId}/versions`
    );
  }

  getByIdAsync(
    owner: string,
    entryId: string,
    entryVersion: number
  ): Observable<LibraryVersionViewModel> {
    return this.http
      .get<LibraryVersionViewModel>(this.url(owner, entryId, entryVersion))
      .pipe(map((list) => this.cleanVm(list)));
  }

  putAsync(owner: string, entryVersion: LibraryEntryVersion): Observable<void> {
    return this.http.put<void>(
      this.url(owner, entryVersion.entryId, entryVersion.version),
      entryVersion
    );
  }

  publishAsync(
    owner: string,
    entryVersion: LibraryEntryVersion
  ): Observable<void> {
    return this.http.put<void>(
      this.url(owner, entryVersion.entryId, entryVersion.version, 'publish'),
      entryVersion
    );
  }

  replicateAsync(
    owner: string,
    entryId: string,
    version: number,
    alias: string
  ): Observable<number> {
    return this.http.put<number>(
      this.url(owner, entryId, version, 'replicate'),
      {
        alias,
      }
    );
  }

  private url(
    owner: string,
    entryId: string,
    version: number,
    suffix?: string
  ): string {
    let url = `api/portfolio/${owner}/library/entries/${entryId}/versions/${version}`;

    if (suffix) url += `/${suffix}`;

    return url;
  }

  private cleanVm(obj: LibraryVersionViewModel): LibraryVersionViewModel {
    Utils.cleanDates(obj, 'lastModified');

    if (obj.disciplines == undefined) obj.disciplines = [];

    return obj;
  }
}
