import { HttpClient } from '@angular/common/http';
import { ListItem } from '@wbs/models';
import { Observable } from 'rxjs';

export class MetdataDataService {
  constructor(private readonly http: HttpClient) {}

  getListAsync(name: string): Observable<ListItem[]> {
    return this.http.get<ListItem[]>(`lists/${name}`);
  }
}
