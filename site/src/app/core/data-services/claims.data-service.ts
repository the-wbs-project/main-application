import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

export class ClaimsDataService {
  private readonly cache = new Map<string, string[]>();

  constructor(private readonly http: HttpClient) {}

  clearCache(): void {
    this.cache.clear();
  }

  getOrganizationClaimsAsync(organization: string): Observable<string[]> {
    if (this.cache.has(organization)) {
      return of(this.cache.get(organization) ?? []);
    }

    return this.http
      .get<string[]>(`api/claims/organization/${organization}`)
      .pipe(tap((data) => this.cache.set(organization, data)));
  }

  getLibraryEntryClaimsAsync(
    organization: string,
    owner: string,
    entry: string,
    version: number
  ): Observable<string[]> {
    const cacheKey = `${organization}/${owner}/${entry}/${version}`;

    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey) ?? []);
    }

    return this.http
      .get<string[]>(
        `api/claims/libraryEntry/${organization}/${owner}/${entry}/${version}`
      )
      .pipe(tap((data) => this.cache.set(cacheKey, data)));
  }
}
