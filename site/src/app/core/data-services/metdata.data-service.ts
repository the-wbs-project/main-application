import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../models';

export class MetdataDataService {
  constructor(private readonly http: HttpClient) {}

  getListAsync<T>(name: string): Observable<T[]> {
    return this.http.get<T[]>(`api/lists/${name}/en-US`);
  }

  getRolesAsync(): Observable<Role[]> {
    return this.http.get<Role[]>('api/roles');
  }
}
