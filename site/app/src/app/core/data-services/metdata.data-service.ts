import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Role } from '../models';

export class MetdataDataService {
  constructor(private readonly http: HttpClient) {}

  getListAsync<T>(name: string): Observable<T[]> {
    return this.http.get<T[]>(`api/lists/${name}/${environment.locale}`);
  }

  getRolesAsync(): Observable<Role[]> {
    return this.http.get<Role[]>('api/roles');
  }
}
