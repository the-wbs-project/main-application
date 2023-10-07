import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Permissions } from '../models';

export class PermissionsDataService {
  constructor(private readonly http: HttpClient) {}

  getAsync(type: 'organization' | 'projects'): Observable<Permissions> {
    return this.http.get<Permissions>(`api/permissions/${type}`);
  }
}
