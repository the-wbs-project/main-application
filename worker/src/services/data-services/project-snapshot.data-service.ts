import { Context } from '../../config';
import { ProjectSnapshot } from '../../models';
import { ProjectNodeDataService } from './project-node.data-service';
import { ProjectDataService } from './project.data-service';
import { StorageService } from './storage.service';

export class ProjectSnapshotDataService {
  private _bucket?: StorageService;

  constructor(
    private readonly ctx: Context,
    private readonly projectService: ProjectDataService,
    private readonly taskService: ProjectNodeDataService,
  ) {}

  getAsync(projectId: string, activityId: string): Promise<ProjectSnapshot | null> {
    return this.bucket.get<ProjectSnapshot>(activityId, [this.organization, projectId]);
  }

  async putAsync(projectId: string, activityId: string): Promise<void> {
    const [project, tasks] = await Promise.all([this.projectService.getAsync(projectId), this.taskService.getAllAsync(projectId)]);
    const snapshot: ProjectSnapshot = {
      ...project!,
      tasks,
    };

    this.ctx.executionCtx.waitUntil(this.bucket.put(activityId, [this.organization, projectId], snapshot));
  }

  private get organization(): string {
    return this.ctx.get('organization').organization;
  }

  private get bucket(): StorageService {
    if (!this._bucket) {
      this._bucket = new StorageService(this.ctx.env.BUCKET_SNAPSHOTS);
    }
    return this._bucket;
  }
}
