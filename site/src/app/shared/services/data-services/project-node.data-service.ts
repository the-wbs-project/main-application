import { HttpClient } from '@angular/common/http';
import { ProjectNode, WbsNode } from '@wbs/shared/models';
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

  putAsync(projectId: string, node: WbsNode): Observable<void> {
    const model: ProjectNode = {
      ...node,
      projectId,
    };
    return this.http.put<void>(
      `projects/${this.ownerId}/${projectId}/nodes/${model.id}`,
      model
    );
  }

  batchAsync(
    projectId: string,
    models: WbsNode[],
    removeIds: string[]
  ): Observable<void> {
    const upserts: ProjectNode[] = [];

    for (const node of models)
      upserts.push({
        ...node,
        projectId,
      });
    return this.http.put<void>(
      `projects/${this.ownerId}/${projectId}/nodes/batch`,
      {
        upserts,
        removeIds,
      }
    );
  }
}
