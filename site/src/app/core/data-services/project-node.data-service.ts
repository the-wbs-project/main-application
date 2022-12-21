import { HttpClient } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ProjectNode, WbsNode } from '../models';
import { AuthState } from '../states';

export class ProjectNodeDataService {
  constructor(
    private readonly http: HttpClient,
    private readonly store: Store
  ) {}

  private get organization(): string {
    return this.store.selectSnapshot(AuthState.organization)!;
  }

  getAllAsync(projectId: string): Observable<WbsNode[]> {
    return this.http.get<WbsNode[]>(
      `projects/${this.organization}/byId/${projectId}/nodes`
    );
  }

  getAsync(projectId: string, taskId: string): Observable<WbsNode> {
    return this.http.get<WbsNode>(
      `projects/${this.organization}/byId/${projectId}/nodes/${taskId}`
    );
  }

  putAsync(projectId: string, node: WbsNode): Observable<void> {
    const model: ProjectNode = {
      ...node,
      projectId,
    };
    return this.http.put<void>(
      `projects/${this.organization}/byId/${projectId}/nodes/${model.id}`,
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
      `projects/byId/${this.organization}/${projectId}/nodes/batch`,
      {
        upserts,
        removeIds,
      }
    );
  }
}
