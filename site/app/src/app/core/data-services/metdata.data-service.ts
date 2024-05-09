import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListItemBase, Role } from '../models';

export class MetdataDataService {
  constructor(private readonly http: HttpClient) {}

  getListAsync<T extends ListItemBase>(name: string): Observable<T[]> {
    return this.http.get<T[]>(`api/lists/${name}`);
  }

  getRolesAsync(): Observable<Role[]> {
    return this.http.get<Role[]>('api/roles');
  }
}
