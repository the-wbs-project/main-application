import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Discussion } from '../models';

export class DiscussionDataService {
  constructor(private readonly http: HttpClient) {}

  getAsync(
    organization: string,
    associationId: string
  ): Observable<Discussion[]> {
    return this.http.get<Discussion[]>(
      `discussions/${organization}/${associationId}`
    );
  }

  putAsync(organization: string, model: Discussion): Observable<void> {
    return this.http.put<void>(
      `discussions/${organization}/${model.id}`,
      model
    );
  }
}
