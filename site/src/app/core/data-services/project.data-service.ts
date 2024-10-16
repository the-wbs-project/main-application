import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  Activity,
  ActivityData,
  Project,
  ProjectApproval,
  ProjectApprovalSaveRecord,
  ProjectNode,
  ProjectNodeToLibraryOptions,
  ProjectToLibraryOptions,
} from '../models';
import { IdService, Utils } from '../services';
import { ProjectViewModel } from '../view-models';

declare type ProjectWithNodesAndApprovals = {
  project: ProjectViewModel;
  tasks: ProjectNode[];
  approvals: ProjectApproval[];
  claims: string[];
};

export class ProjectDataService {
  constructor(private readonly http: HttpClient) {}

  getAllAsync(owner: string): Observable<Project[]> {
    return this.http
      .get<Project[]>(`api/portfolio/${owner}/projects`)
      .pipe(tap((list) => this.cleanList(list)));
  }

  getIdAsync(owner: string, recordId: string): Observable<string> {
    return this.http.get<string>(
      `api/portfolio/${owner}/projects/${recordId}/id`
    );
  }

  getRecordIdAsync(owner: string, projectId: string): Observable<string> {
    return this.http.get<string>(
      `api/portfolio/${owner}/projects/${projectId}/recordId`
    );
  }

  getAsync(
    owner: string,
    projectId: string
  ): Observable<ProjectWithNodesAndApprovals> {
    return this.http
      .get<ProjectWithNodesAndApprovals>(
        `api/portfolio/${owner}/projects/${projectId}`
      )
      .pipe(tap((data) => this.clean(data)));
  }

  putProjectAsync(project: Project): Observable<void> {
    return this.http.put<void>(
      `api/portfolio/${project.owner}/projects/${project.id}`,
      project
    );
  }

  deleteProjectAsync(owner: string, projectId: string): Observable<void> {
    return this.http.delete<void>(
      `api/portfolio/${owner}/projects/${projectId}`
    );
  }

  putTasksAsync(
    owner: string,
    projectId: string,
    upserts: ProjectNode[],
    removeIds: string[]
  ): Observable<void> {
    return this.http.put<void>(
      `api/portfolio/${owner}/projects/${projectId}/nodes`,
      {
        upserts,
        removeIds,
      }
    );
  }

  putApprovalAsync(
    owner: string,
    projectId: string,
    approval: ProjectApprovalSaveRecord
  ): Observable<void> {
    return this.http.put<void>(
      `api/portfolio/${owner}/projects/${projectId}/approvals`,
      approval
    );
  }

  exportProjectToLibraryAsync(
    owner: string,
    projectId: string,
    model: ProjectToLibraryOptions
  ): Observable<string> {
    return this.http.post(
      `api/portfolio/${owner}/projects/${projectId}/export/libraryEntry`,
      model,
      {
        responseType: 'text',
      }
    );
  }

  exportTaskToLibraryAsync(
    owner: string,
    projectId: string,
    nodeId: string,
    model: ProjectNodeToLibraryOptions
  ): Observable<string> {
    return this.http.post(
      `api/portfolio/${owner}/projects/${projectId}/nodes/${nodeId}/export/libraryEntry`,
      model,
      {
        responseType: 'text',
      }
    );
  }

  postActivitiesAsync(
    owner: string,
    projectId: string,
    userId: string,
    data: ActivityData[]
  ): Observable<void> {
    const activities: Activity[] = [];

    for (const d of data) {
      activities.push({
        ...d,
        id: IdService.generate(),
        timestamp: new Date(),
        userId: userId,
      });
    }
    return this.http.post<void>(
      `api/portfolio/${owner}/projects/${projectId}/activities`,
      activities
    );
  }

  private cleanList(projects: (ProjectViewModel | Project)[]): void {
    Utils.cleanDates(projects, 'createdOn', 'lastModified');
  }

  private clean(data: ProjectWithNodesAndApprovals): void {
    Utils.cleanDates(data.project, 'createdOn', 'lastModified');
    Utils.cleanDates(data.tasks, 'createdOn', 'lastModified');
    Utils.cleanDates(data.approvals, 'approvedOn');
  }
}
