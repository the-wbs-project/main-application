import { Context } from '../../config';
import { Project, ProjectNode, TaggedObject } from '../../models';
import { CosmosDbService } from './cosmos-db.service';

export class ProjectNodeDataService {
  private readonly db: CosmosDbService;

  constructor(private readonly ctx: Context) {
    this.db = new CosmosDbService(this.ctx, 'ProjectNodes', 'projectId');
  }

  async migrateAsync(): Promise<void> {
    const owner = 'acme_engineering';
    const projectDb = new CosmosDbService(this.ctx, 'Projects', 'id');
    const projects = await projectDb.getAllByPartitionAsync<Project>(owner, true);

    console.log(projects?.length);

    for (const project of projects!) {
      const nodes: any[] = (await this.db.getAllByPartitionAsync<WbsNodeLegacy>(project.id, true)) ?? [];
      const upserts: any[] = [];

      for (const node of nodes) {
        if (node.removed) continue;

        node.createdOn = new Date(node.createdOn);
        node.lastModified = new Date(node.lastModified);

        delete node.phase;
        delete node.discipline;

        upserts.push(node);
      }
      const res = await this.ctx.get('origin').putAsync(`projects/owner/${project.owner}/id/${project.id}/nodes`, { upserts });

      if (res.status > 204) {
        console.log(res.status + ' ' + (await res.text()));
      }
    }
  }
}

interface WbsNodeLegacy extends TaggedObject {
  id: string;
  title?: string;
  removed?: boolean;
  parentId: string | null;
  order: number;
  createdOn: number;
  lastModified: number;
  description?: string | null;
  disciplineIds?: string[] | null;
  phase?: any;
  discipline?: any[];
}
