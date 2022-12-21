import { HttpClient } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Project } from '../models';
import { AuthState } from '../states';

export class ProjectDataService {
  constructor(
    private readonly http: HttpClient,
    private readonly store: Store
  ) {}

  private get organization(): string {
    return this.store.selectSnapshot(AuthState.organization)!;
  }

  getMyAsync(): Observable<Project[]> {
    return this.http.get<Project[]>(`projects/${this.organization}/my`);
  }

  getWatchedAsync(): Observable<Project[]> {
    return this.http.get<Project[]>(`projects/${this.organization}/watched`);
  }

  getAsync(projectId: string): Observable<Project> {
    return this.http.get<Project>(
      `projects/${this.organization}/byId/${projectId}`
    );
  }

  putAsync(project: Project): Observable<void> {
    return this.http.put<void>(
      `projects/${this.organization}/byId/${project.id}`,
      project
    );
  }
}
