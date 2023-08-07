import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../models';

export class ProjectDataService {
  constructor(private readonly http: HttpClient) {}

  getAllAsync(organization: string): Observable<Project[]> {
    return this.http.get<Project[]>(`api/projects/${organization}/all`);
  }

  getAssignedAsync(organization: string): Observable<Project[]> {
    return this.http.get<Project[]>(`api/projects/${organization}/assigned`);
  }

  getAsync(organization: string, projectId: string): Observable<Project> {
    return this.http.get<Project>(
      `api/projects/${organization}/byId/${projectId}`
    );
  }

  putAsync(project: Project): Observable<void> {
    return this.http.put<void>(
      `api/projects/${project.owner}/byId/${project.id}`,
      project
    );
  }
}
