import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project, ProjectNode } from '../models';

export class ProjectSnapshotDataService {
  constructor(private readonly http: HttpClient) {}

  getAsync(
    owner: string,
    projectId: string,
    activityId: string
  ): Observable<Project> {
    return this.http.get<Project>(
      `api/portfolio/${owner}/projects/${projectId}/snapshots/${activityId}`
    );
  }

  putAsync(
    owner: string,
    activityId: string,
    project: Project,
    nodes: ProjectNode[]
  ): Observable<void> {
    return this.http.put<void>(
      `api/portfolio/${owner}/projects/${project.id}/snapshot/${activityId}`,
      { project, nodes }
    );
  }
}
