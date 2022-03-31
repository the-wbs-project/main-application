import { HttpClient } from '@angular/common/http';
import { PROJECT_VIEW, WbsDisciplineNode, WbsPhaseNode } from '@wbs/models';
import { Observable } from 'rxjs';

export class WbsDataService {
  constructor(private readonly http: HttpClient) {}

  getPhaseList(ownerId: string, projectId: string): Observable<WbsPhaseNode[]> {
    return this.http.get<WbsPhaseNode[]>(
      `projects/${ownerId}/${projectId}/wbs/${PROJECT_VIEW.PHASE}`
    );
  }

  getDisciplineList(
    ownerId: string,
    projectId: string
  ): Observable<WbsDisciplineNode[]> {
    return this.http.get<WbsPhaseNode[]>(
      `projects/${ownerId}/${projectId}/wbs/${PROJECT_VIEW.DISCIPLINE}`
    );
  }
}
