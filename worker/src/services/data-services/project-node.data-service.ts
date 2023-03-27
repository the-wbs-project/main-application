import { ProjectNode } from '../../models';
import { DbService } from '../database-services';

export class ProjectNodeDataService {
  constructor(private readonly db: DbService) {}

  getAllAsync(projectId: string): Promise<ProjectNode[] | undefined> {
    return this.getFromDbAsync(projectId);
  }

  async putAsync(node: ProjectNode): Promise<void> {
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
