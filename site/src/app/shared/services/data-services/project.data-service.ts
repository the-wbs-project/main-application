import { HttpClient } from '@angular/common/http';
import { Project } from '@wbs/shared/models';
import { Observable } from 'rxjs';

export class ProjectDataService {
  private ownerId: string | undefined;

  constructor(private readonly http: HttpClient) {}

  setOwner(ownerId: string | undefined) {
    this.ownerId = ownerId;
  }

  getAsync(projectId: string): Observable<Project> {
    return this.http.get<Project>(`projects/${this.ownerId}/${projectId}`);
  }

  putAsync(project: Project): Observable<void> {
    return this.http.put<void>(
      `projects/${this.ownerId}/${project.id}`,
      project
    );
  }
}
