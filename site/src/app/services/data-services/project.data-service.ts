import { HttpClient } from '@angular/common/http';
import { Project } from '@app/models';
import { Observable } from 'rxjs';

export class ProjectDataService {
  constructor(private readonly http: HttpClient) {}

  getAsync(ownerId: string, projectId: string): Observable<Project> {
    return this.http.get<Project>(`projects/${ownerId}/${projectId}`);
  }
}
