import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LibrarySearchFilters } from '../models';
import { Utils } from '../services';
import { LibraryDraftViewModel, LibraryViewModel } from '../view-models';

export class LibraryDataService {
  constructor(private readonly http: HttpClient) {}

  getDraftsAsync(
    owner: string,
    types: string[] | 'all'
  ): Observable<LibraryDraftViewModel[]> {
    const params = types == 'all' ? 'all' : types.join(',');

    return this.http
      .get<LibraryDraftViewModel[]>(`api/libraries/drafts/${owner}/${params}`)
      .pipe(map(this.clean));
  }

  getInternalAsync(
    owner: string,
    filters: LibrarySearchFilters
  ): Observable<LibraryViewModel[]> {
    return this.http
      .post<LibraryViewModel[]>(`api/libraries/internal/${owner}`, filters)
      .pipe(map(this.clean));
  }

  getPublicAsync(
    filters: LibrarySearchFilters
  ): Observable<LibraryViewModel[]> {
    return this.http
      .post<LibraryViewModel[]>('api/libraries/public', filters)
      .pipe(map(this.clean));
  }

  private clean<T extends (LibraryViewModel | LibraryDraftViewModel)[]>(
    obj: T
  ): T {
    Utils.cleanDates(obj, 'lastModified');

    return obj;
  }
}
