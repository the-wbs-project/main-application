import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../models';

export class ProjectSnapshotDataService {
  constructor(private readonly http: HttpClient) {}

  getAsync(
    organization: string,
    projectId: string,
    activityId: string
  ): Observable<Project> {
    return this.http.get<Project>(
      `api/projects/snapshot/${organization}/${projectId}/${activityId}`
    );
  }
}
