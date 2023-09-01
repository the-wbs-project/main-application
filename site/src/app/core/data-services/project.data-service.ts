import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Project } from '../models';

export class ProjectDataService {
  constructor(private readonly http: HttpClient) {}

  getAllAsync(owner: string): Observable<Project[]> {
    return this.http
      .get<Project[]>(`api/projects/owner/${owner}`)
      .pipe(map((list) => this.cleanList(list)));
  }

  getAsync(owner: string, projectId: string): Observable<Project> {
    return this.http
      .get<Project>(`api/projects/owner/${owner}/id/${projectId}`)
      .pipe(map((node) => this.clean(node)));
  }

  putAsync(project: Project): Observable<void> {
    return this.http.put<void>(`api/projects/owner/${project.owner}`, project);
  }

  private cleanList(projects: Project[]): Project[] {
    for (const project of projects) this.clean(project);

    return projects;
  }

  private clean(project: Project): Project {
    if (typeof project.createdOn === 'string')
      project.createdOn = new Date(project.createdOn);

    if (typeof project.lastModified === 'string')
      project.lastModified = new Date(project.lastModified);

    return project;
  }
}
