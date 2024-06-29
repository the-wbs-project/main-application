import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

export class OrganizationDataService {
  private readonly cache = new Map<string, string>();

  constructor(private readonly http: HttpClient) {}

  getNameAsync(name: string): Observable<string> {
    if (this.cache.has(name)) {
      return of(this.cache.get(name)!);
    }

    return this.http
      .get<string>(`api/organizations/${name}`)
      .pipe(tap((data) => this.cache.set(name, data)));
  }

  addToCache(id: string, name: string): void {
    this.cache.set(id, name);
  }
}
