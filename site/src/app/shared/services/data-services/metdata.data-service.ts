import { HttpClient } from '@angular/common/http';
import { ListItemBase } from '@wbs/shared/models';
import { Observable } from 'rxjs';

export class MetdataDataService {
  constructor(private readonly http: HttpClient) {}

  getListAsync<T extends ListItemBase>(name: string): Observable<T[]> {
    return this.http.get<T[]>(`lists/${name}`);
  }
}
