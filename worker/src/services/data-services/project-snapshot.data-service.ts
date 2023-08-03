import { Context } from '../../config';
import { ProjectSnapshot } from '../../models';
import { StorageService } from './storage.service';

export class ProjectSnapshotDataService {
  private _bucket?: StorageService;

  constructor(private readonly ctx: Context) {}

  getAsync(owner: string, projectId: string, activityId: string): Promise<ProjectSnapshot | null> {
    return this.bucket.get<ProjectSnapshot>(activityId, [owner, projectId]);
  }

  async putAsync(activityId: string, snapshot: ProjectSnapshot): Promise<void> {
    this.ctx.executionCtx.waitUntil(this.bucket.put(activityId, [snapshot.owner, snapshot.id], snapshot));
  }

  private get bucket(): StorageService {
    if (!this._bucket) {
      this._bucket = new StorageService(this.ctx.env.BUCKET_SNAPSHOTS);
    }
    return this._bucket;
  }
}
