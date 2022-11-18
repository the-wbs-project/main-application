import { ProjectNode } from '../../models';
import { DbService } from '../database-services';

export class ProjectNodeDataService {
  constructor(private readonly db: DbService) {}

  async getAllAsync(projectId: string): Promise<ProjectNode[]> {
    const data = (await this.getFromDbAsync(projectId)) ?? [];

    for (const d of data) {
      if (!d.parentId) {
        if (d.phase && d.phase.parentId) {
          d.parentId = d.phase.parentId;

          delete d.phase.parentId;
          await this.putAsync(d);
        }
      }
      if (!d.order) {
        if (d.phase && d.phase.order) {
          d.order = d.phase.order;

          delete d.phase.order;
          await this.putAsync(d);
        }
      }
      if (d.discipline)
        for (const dd of d.discipline) {
          if (dd.parentId) {
            delete dd.parentId;
            delete dd.isPhaseNode;
            delete dd.phaseId;
            await this.putAsync(d);
          }
        }
    }
    return data;
  }

  async putAsync(node: ProjectNode): Promise<void> {
    await this.db.upsertDocument(node, node.projectId);
  }

  async batchAsync(projectId: string, upserts: ProjectNode[], removeIds: string[]): Promise<void> {
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

  private getFromDbAsync(projectId: string): Promise<ProjectNode[]> {
    return this.db.getAllByPartitionAsync<ProjectNode>(projectId, true);
  }
}
