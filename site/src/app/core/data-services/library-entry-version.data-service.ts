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
      .get<LibraryVersionViewModel>(
        `api/portfolio/${owner}/library/entries/${entryId}/versions/${entryVersion}`
      )
      .pipe(map((list) => this.cleanVm(list)));
  }

  putAsync(owner: string, entryVersion: LibraryEntryVersion): Observable<void> {
    return this.http.put<void>(
      `api/portfolio/${owner}/library/entries/${entryVersion.entryId}/versions/${entryVersion.version}`,
      entryVersion
    );
  }

  publishAsync(
    owner: string,
    entryVersion: LibraryEntryVersion
  ): Observable<void> {
    return this.http.put<void>(
      `api/portfolio/${owner}/library/entries/${entryVersion.entryId}/versions/${entryVersion.version}/publish`,
      entryVersion
    );
  }

  private cleanVm(obj: LibraryVersionViewModel): LibraryVersionViewModel {
    Utils.cleanDates(obj, 'lastModified');

    if (obj.categories == undefined) obj.categories = [];
    if (obj.disciplines == undefined) obj.disciplines = [];

    return obj;
  }
}
