import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectApproval } from '../models';
import { Utils } from '../services';

export class ProjectApprovalDataService {
  constructor(private readonly http: HttpClient) {}

  getAllAsync(owner: string, projectId: string): Observable<ProjectApproval[]> {
    return this.http
      .get<ProjectApproval[]>(
        `api/projects/owner/${owner}/id/${projectId}/approvals`
      )
      .pipe(map((list) => this.clean(list)));
  }

  putAsync(
    owner: string,
    projectId: string,
    approval: ProjectApproval
  ): Observable<void> {
    return this.http.put<void>(
      `api/projects/owner/${owner}/id/${projectId}/approvals/${approval.id}`,
      approval
    );
  }

  private clean(nodes: ProjectApproval[]): ProjectApproval[] {
    Utils.cleanDates(nodes, 'approvedOn');

    return nodes;
  }
}
