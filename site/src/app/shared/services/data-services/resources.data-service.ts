import { HttpClient } from '@angular/common/http';
import { ResourceSections } from '@wbs/models';
import { Observable } from 'rxjs';

export class ResourcesDataService {
  constructor(private readonly http: HttpClient) {}

  getAsync(category: string): Observable<ResourceSections> {
    return this.http.get<ResourceSections>(`resources/${category}`);
  }
}
