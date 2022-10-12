import { HttpClient } from '@angular/common/http';
import { Project } from '@wbs/shared/models';
import { Observable } from 'rxjs';

export class ProjectSnapshotDataService {
  constructor(private readonly http: HttpClient) {}

  getAsync(projectId: string, activityId: string): Observable<Project> {
    return this.http.get<Project>(
      `projects/snapshot/${projectId}/${activityId}`
    );
  }
}
