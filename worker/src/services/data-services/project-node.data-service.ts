import { Context } from '../../config';
import { ProjectNode } from '../../models';
import { CosmosDbService } from './cosmos-db.service';

export class ProjectNodeDataService {
  private readonly db: CosmosDbService;

  constructor(private readonly ctx: Context) {
    this.db = new CosmosDbService(this.ctx, 'ProjectNodes', 'projectId');
  }

  async getAllAsync(projectId: string): Promise<ProjectNode[] | undefined> {
    const nodes = await this.getFromDbAsync(projectId);

    if (nodes)
      for (const node of nodes) {
        if (!node.createdOn) {
          //@ts-ignore
          const ts = node._ts;
          node.createdOn = ts * 1000;
          node.lastModified = ts * 1000;

          await this.putAsync(node);
        }
      }

    return nodes;
  }

  async putAsync(node: ProjectNode): Promise<void> {
    node.lastModified = Date.now();

    await this.db.upsertDocument(node, node.projectId);
  }

  async batchAsync(projectId: string, upserts: ProjectNode[], removeIds: string[]): Promise<void> {
    const all = (await this.getAllAsync(projectId)) ?? [];
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
      if (!node || node.projectId !== projectId) throw new Error('Invalid_Project_Id');

      node.removed = true;
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
  }

  private getFromDbAsync(projectId: string): Promise<ProjectNode[] | undefined> {
    return this.db.getAllByPartitionAsync<ProjectNode>(projectId, true);
  }
}
