import { HttpClient } from '@angular/common/http';
import { ProjectLite } from '@app/models';
import { Observable } from 'rxjs';

export class ProjectDataService {
  constructor(private readonly http: HttpClient) {}

  getAsync(ownerId: string, projectId: string): Observable<ProjectLite> {
    return this.http.get<ProjectLite>(`projects/${ownerId}/${projectId}`);
  }
}
