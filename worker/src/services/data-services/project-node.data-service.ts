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
    //if (this.edge.byPass(kvPrefix)) return await this.getFromDbAsync(projectId);

    //const kvName = [kvPrefix, projectId].join('-');
    //const kvData = await this.edge.get<ProjectNode[]>(kvName, 'json');

    //if (kvData) return kvData;

    const data = await this.getFromDbAsync(projectId);

    //if (data) this.edge.putLater(kvName, JSON.stringify(data));

    return data;
  }

  async putAsync(node: ProjectNode): Promise<void> {
    //const kvName = [kvPrefix, node.projectId].join('-');

    await this.db.upsertDocument(node, node.projectId);

    //this.edge.delete(kvName);
  }

  async batchAsync(
    projectId: string,
    upserts: ProjectNode[],
    removeIds: string[],
  ): Promise<void> {
    const all = await this.getAllAsync(projectId);
    //
    //  First we are going to validate that all upserts have the proper project ID.
    //
    for (const node of upserts) {
      if (node.projectId !== projectId) throw new Error('Invalid_Project_Id');
    }
    //
    //  Next we will verify all items to remove are actually from this project
    //
    for (const nodeId of removeIds) {
      const node = all.find((x) => x.id === nodeId);
      if (!node || node.projectId !== projectId)
        throw new Error('Invalid_Project_Id');
      //
      //  Now add node to the list to upsert
      //
      upserts.push(node);
    }
    let batch: Promise<unknown>[] = [];

    for (const node of upserts) {
      batch.push(this.db.upsertDocument(node, node.projectId));

      if (batch.length === 5) {
        await Promise.all(batch);
        batch = [];
      }
    }
    if (batch.length > 0) {
      await Promise.all(batch);
    }
    //
    //  Delete the KV values
    //
    //this.edge.delete([kvPrefix, projectId].join('-'));
  }

  private getFromDbAsync(projectId: string): Promise<ProjectNode[]> {
    return this.db.getAllByPartitionAsync<ProjectNode>(projectId, true);
  }
}
