import { HttpClient } from '@angular/common/http';
import { Project, ProjectLite } from '@wbs/models';
import { Observable } from 'rxjs';

export class ProjectDataService {
  private ownerId: string | undefined;

  constructor(private readonly http: HttpClient) {}

  setOwner(ownerId: string | undefined) {
    this.ownerId = ownerId;
  }

  getAsync(projectId: string): Observable<Project> {
    return this.http.get<Project>(`projects/${this.ownerId}/${projectId}/full`);
  }

  getLiteAsync(projectId: string): Observable<ProjectLite> {
    return this.http.get<ProjectLite>(
      `projects/${this.ownerId}/${projectId}/lite`
    );
  }
}
