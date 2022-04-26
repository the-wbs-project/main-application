import { HttpClient } from '@angular/common/http';
import { WbsNode } from '@wbs/models';
import { Observable } from 'rxjs';

export class ProjectNodeDataService {
  private ownerId: string | undefined;

  constructor(private readonly http: HttpClient) {}

  setOwner(ownerId: string | undefined) {
    this.ownerId = ownerId;
  }

  getAsync(projectId: string): Observable<WbsNode[]> {
    return this.http.get<WbsNode[]>(
      `projects/${this.ownerId}/${projectId}/nodes`
    );
  }
}
