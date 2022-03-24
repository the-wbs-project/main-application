import { HttpClient } from '@angular/common/http';
import { PROJECT_VIEW, WbsPhaseNode } from '@app/models';
import { Observable } from 'rxjs';

export class WbsDataService {
  constructor(private readonly http: HttpClient) {}

  getPhaseList(ownerId: string, projectId: string): Observable<WbsPhaseNode[]> {
    return this.http.get<WbsPhaseNode[]>(
      `projects/${ownerId}/${projectId}/wbs/${PROJECT_VIEW.PHASE}`
    );
  }
}
