import { HttpClient } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Project } from '../models';
import { AuthState } from '../states';

export class ProjectSnapshotDataService {
  constructor(
    private readonly http: HttpClient,
    private readonly store: Store
  ) {}

  private get organization(): string {
    return this.store.selectSnapshot(AuthState.organization)!;
  }

  getAsync(projectId: string, activityId: string): Observable<Project> {
    return this.http.get<Project>(
      `projects/snapshot/${this.organization}/${projectId}/${activityId}`
    );
  }
}
