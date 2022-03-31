import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export class ResourcesDataService {
  constructor(private readonly http: HttpClient) {}

  getAsync(
    category: string
  ): Observable<{ [cat: string]: { [key: string]: string } }> {
    return this.http.get<{ [cat: string]: { [key: string]: string } }>(
      `resources/${category}`
    );
  }
}
