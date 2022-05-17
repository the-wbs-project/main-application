import { HttpClient } from '@angular/common/http';
import { ProjectNode, WbsNode } from '@wbs/shared/models';
import { Observable } from 'rxjs';

export class ProjectNodeDataService {
  constructor(private readonly http: HttpClient) {}

  getAsync(projectId: string): Observable<WbsNode[]> {
    return this.http.get<WbsNode[]>(`projects/byId/${projectId}/nodes`);
  }

  putAsync(projectId: string, node: WbsNode): Observable<void> {
    const model: ProjectNode = {
      ...node,
      projectId,
    };
    return this.http.put<void>(
      `projects/byId/${projectId}/nodes/${model.id}`,
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
    return this.http.put<void>(`projects/byId/${projectId}/nodes/batch`, {
      upserts,
      removeIds,
    });
  }
}
