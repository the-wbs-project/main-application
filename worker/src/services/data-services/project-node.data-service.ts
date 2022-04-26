import { ProjectNode } from '../../models';
import { DbService } from '../database-services';
import { EdgeDataService } from '../edge-services';

const kvPrefix = 'PROJECTNODES';

export class ProjectNodeDataService {
  constructor(
    private readonly db: DbService,
    private readonly edge: EdgeDataService,
  ) {}

  async getAllAsync(projectId: string): Promise<ProjectNode[]> {
    if (this.edge.byPass(kvPrefix)) return await this.getFromDbAsync(projectId);

    const kvName = [kvPrefix, projectId].join('-');
    const kvData = await this.edge.get<ProjectNode[]>(kvName, 'json');

    if (kvData) return kvData;

    const data = await this.getFromDbAsync(projectId);

    if (data) this.edge.putLater(kvName, JSON.stringify(data));

    return data;
  }

  async putAsync(node: ProjectNode): Promise<void> {
    const kvName = [kvPrefix, node.projectId].join('-');

    await this.db.upsertDocument(node, node.projectId);

    this.edge.delete(kvName);
  }

  private getFromDbAsync(projectId: string): Promise<ProjectNode[]> {
    return this.db.getAllByPartitionAsync<ProjectNode>(projectId, true);
  }
}
