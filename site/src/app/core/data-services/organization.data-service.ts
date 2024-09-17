import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export class OrganizationDataService {
  constructor(private readonly http: HttpClient) {}

  getNameAsync(name: string): Observable<string> {
    return this.http.get<string>(`api/organizations/${name}`);
  }
}
