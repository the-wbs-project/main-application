import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LibraryEntryVersionReview } from '../models';
import { Utils } from '../services';

export class LibraryEntryVersionReviewDataService {
  constructor(private readonly http: HttpClient) {}

  getRatingAsync(
    owner: string,
    entryId: string,
    entryVersion: number
  ): Observable<number | undefined> {
    return this.http.get<number | undefined>(
      `api/portfolio/${owner}/library/entries/${entryId}/versions/${entryVersion}/rating`
    );
  }

  getReviewsAsync(
    owner: string,
    entryId: string,
    entryVersion: number
  ): Observable<LibraryEntryVersionReview[]> {
    return this.http
      .get<LibraryEntryVersionReview[]>(
        `api/portfolio/${owner}/library/entries/${entryId}/versions/${entryVersion}/reviews`
      )
      .pipe(map((list) => this.clean(list)));
  }

  setReviewAsync(
    owner: string,
    entryId: string,
    entryVersion: number,
    review: LibraryEntryVersionReview
  ): Observable<void> {
    return this.http.put<void>(
      `api/portfolio/${owner}/library/entries/${entryId}/versions/${entryVersion}/reviews`,
      review
    );
  }

  private clean(
    list: LibraryEntryVersionReview[]
  ): LibraryEntryVersionReview[] {
    for (const obj of list) {
      Utils.cleanDates(obj, 'timestamp');
    }
    return list;
  }
}
