import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StarterData } from '../models';

export class MetdataDataService {
  constructor(private readonly http: HttpClient) {}

  getStarterDataAsync(): Observable<StarterData> {
    return this.http.get<StarterData>('api/startup');
  }

  getListAsync<T>(name: string): Observable<T[]> {
    return this.http.get<T[]>(`api/lists/${name}/en-US`);
  }
}
