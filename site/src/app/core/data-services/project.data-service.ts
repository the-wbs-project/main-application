import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Member, Project, ProjectToLibraryOptions } from '../models';

export class ProjectDataService {
  constructor(private readonly http: HttpClient) {}

  getAllAsync(owner: string): Observable<Project[]> {
    return this.http
      .get<Project[]>(`api/portfolio/${owner}/projects`)
      .pipe(map((list) => this.cleanList(list)));
  }

  getAsync(owner: string, projectId: string): Observable<Project> {
    return this.http
      .get<Project>(`api/portfolio/${owner}/projects/${projectId}`)
      .pipe(map((node) => this.clean(node)));
  }

  exportToLibraryAsync(
    owner: string,
    projectId: string,
    model: ProjectToLibraryOptions
  ): Observable<string> {
    return this.http.post<string>(
      `api/portfolio/${owner}/projects/${projectId}/export/libraryEntry`,
      model
    );
  }

  getUsersAsync(owner: string, projectId: string): Observable<Member[]> {
    return this.http.get<Member[]>(
      `api/portfolio/${owner}/projects/${projectId}/users`
    );
  }

  putAsync(project: Project): Observable<void> {
    return this.http.put<void>(
      `api/portfolio/${project.owner}/projects/${project.id}`,
      project
    );
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
