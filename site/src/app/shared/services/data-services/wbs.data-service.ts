import { HttpClient } from '@angular/common/http';
import { PROJECT_VIEW, WbsDisciplineNode, WbsPhaseNode } from '@wbs/models';
import { Observable } from 'rxjs';

export class WbsDataService {
  private ownerId: string | undefined;

  constructor(private readonly http: HttpClient) {}

  setOwner(ownerId: string | undefined) {
    this.ownerId = ownerId;
  }

  getPhaseList(projectId: string): Observable<WbsPhaseNode[]> {
    return this.http.get<WbsPhaseNode[]>(
      `projects/${this.ownerId}/${projectId}/wbs/${PROJECT_VIEW.PHASE}`
    );
  }

  getDisciplineList(projectId: string): Observable<WbsDisciplineNode[]> {
    return this.http.get<WbsPhaseNode[]>(
      `projects/${this.ownerId}/${projectId}/wbs/${PROJECT_VIEW.DISCIPLINE}`
    );
  }
}
