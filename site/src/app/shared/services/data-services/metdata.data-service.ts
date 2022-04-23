import { HttpClient } from '@angular/common/http';
import { ListItem, ResourceSections } from '@wbs/models';
import { Observable } from 'rxjs';

export class MetdataDataService {
  constructor(private readonly http: HttpClient) {}

  getResourcesAsync(category: string): Observable<ResourceSections> {
    return this.http.get<ResourceSections>(`resources/${category}`);
  }

  getListAsync(name: string): Observable<ListItem[]> {
    return this.http.get<ListItem[]>(`lists/${name}`);
  }
}
