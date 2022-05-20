import { HttpClient } from '@angular/common/http';
import { Project } from '@wbs/shared/models';
import { Observable } from 'rxjs';

export class ProjectDataService {
  constructor(private readonly http: HttpClient) {}

  getMyAsync(): Observable<Project[]> {
    return this.http.get<Project[]>(`projects/my`);
  }

  getWatchedAsync(): Observable<Project[]> {
    return this.http.get<Project[]>(`projects/watched`);
  }

  getAsync(projectId: string): Observable<Project> {
    return this.http.get<Project>(`projects/byId/${projectId}`);
  }

  putAsync(project: Project): Observable<void> {
    return this.http.put<void>(`projects/byId/${project.id}`, project);
  }
}
