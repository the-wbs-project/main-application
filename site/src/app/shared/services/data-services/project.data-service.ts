import { HttpClient } from '@angular/common/http';
import { Project, ProjectLite } from '@wbs/models';
import { Observable } from 'rxjs';

export class ProjectDataService {
  constructor(private readonly http: HttpClient) {}

  getAsync(ownerId: string, projectId: string): Observable<Project> {
    return this.http.get<Project>(`projects/${ownerId}/${projectId}/full`);
  }

  getLiteAsync(ownerId: string, projectId: string): Observable<ProjectLite> {
    return this.http.get<ProjectLite>(`projects/${ownerId}/${projectId}/lite`);
  }
}
