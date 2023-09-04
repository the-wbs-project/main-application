import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project, ProjectNode } from '../models';

export class ProjectSnapshotDataService {
  constructor(private readonly http: HttpClient) {}

  getAsync(
    organization: string,
    projectId: string,
    activityId: string
  ): Observable<Project> {
    return this.http.get<Project>(
      `api/projects/${organization}/snapshot/${projectId}/${activityId}`
    );
  }

  putAsync(
    owner: string,
    activityId: string,
    project: Project,
    nodes: ProjectNode[]
  ): Observable<void> {
    return this.http.put<void>(
      `api/owner/${owner}/id/${project.id}/snapshot/${activityId}`,
      { project, nodes }
    );
  }
}
