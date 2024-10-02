import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export class MiscDataService {
  constructor(private readonly http: HttpClient) {}

  clearKvCache(): Observable<void> {
    return this.http.get<void>('api/cache/clear');
  }

  rebuildSearchIndex(): Observable<void> {
    return this.http.get<void>('api/tools/rebuild');
  }
}
