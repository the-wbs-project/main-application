import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectNode, WbsNode } from '../models';

export class ProjectNodeDataService {
  constructor(private readonly http: HttpClient) {}

  getAllAsync(organization: string, projectId: string): Observable<WbsNode[]> {
    return this.http.get<WbsNode[]>(
      `api/projects/${organization}/byId/${projectId}/nodes`
    );
  }

  getAsync(
    organization: string,
    projectId: string,
    taskId: string
  ): Observable<WbsNode> {
    return this.http.get<WbsNode>(
      `api/projects/${organization}/byId/${projectId}/nodes/${taskId}`
    );
  }

  putAsync(
    organization: string,
    projectId: string,
    node: WbsNode
  ): Observable<void> {
    const model: ProjectNode = {
      ...node,
      projectId,
    };
    return this.http.put<void>(
      `api/projects/${organization}/byId/${projectId}/nodes/${model.id}`,
      model
    );
  }

  batchAsync(
    organization: string,
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
      `api/projects/${organization}/byId/${projectId}/nodes/batch`,
      {
        upserts,
        removeIds,
      }
    );
  }
}
