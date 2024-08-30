import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Member, Project, ProjectToLibraryOptions } from '../models';
import { ProjectViewModel } from '../view-models';

export class ProjectDataService {
  constructor(private readonly http: HttpClient) {}

  getAllAsync(owner: string): Observable<ProjectViewModel[]> {
    return this.http
      .get<ProjectViewModel[]>(`api/portfolio/${owner}/projects`)
      .pipe(map((list) => this.cleanList(list)));
  }

  getIdAsync(owner: string, recordId: string): Observable<string> {
    return this.http.get<string>(
      `api/portfolio/${owner}/projects/${recordId}/id`
    );
  }

  getAsync(owner: string, projectId: string): Observable<ProjectViewModel> {
    return this.http
      .get<ProjectViewModel>(`api/portfolio/${owner}/projects/${projectId}`)
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

  putAsync(project: Project): Observable<void> {
    return this.http.put<void>(
      `api/portfolio/${project.owner}/projects/${project.id}`,
      project
    );
  }

  private cleanList(projects: ProjectViewModel[]): ProjectViewModel[] {
    for (const project of projects) this.clean(project);

    return projects;
  }

  private clean(project: ProjectViewModel): ProjectViewModel {
    if (typeof project.createdOn === 'string')
      project.createdOn = new Date(project.createdOn);

    if (typeof project.lastModified === 'string')
      project.lastModified = new Date(project.lastModified);

    return project;
  }
}
