import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export class PermissionsDataService {
  constructor(private readonly http: HttpClient) {}

  getAsync(type: 'projects'): Observable<{ [key: string]: string[] }> {
    return this.http.get<{ [key: string]: string[] }>(
      `api/permissions/${type}`
    );
  }
}
