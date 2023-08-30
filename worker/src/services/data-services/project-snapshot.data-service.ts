import { Context } from '../../config';
import { Project, ProjectSnapshot, ProjectSnapshotLegacy } from '../../models';
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

  async migrateAsync(): Promise<void> {
    const owner = 'acme_engineering';
    const projects = await this.ctx.get('origin').getAsync<Project[]>(`projects/owner/${owner}`);

    console.log(projects.length);

    for (const project of projects) {
      const objects = await this.bucket.list([owner, project.id]);

      for (const object of objects) {
        const activity = object.key.split('/')[2];
        const snapshot = await this.bucket.get<ProjectSnapshotLegacy>(activity, [owner, project.id]);

        if (snapshot?.categories) {
          if (typeof snapshot.lastModified === 'number') {
            snapshot.lastModified = new Date(snapshot.lastModified);
          }
          if (typeof snapshot.createdOn === 'number') {
            snapshot.createdOn = new Date(snapshot.createdOn);
          }

          const newSnapshot: ProjectSnapshot = {
            id: snapshot.id,
            owner: snapshot.owner,
            category: snapshot.category,
            createdBy: snapshot.createdBy,
            createdOn: snapshot.createdOn,
            description: snapshot.description,
            disciplines: snapshot.categories.discipline,
            lastModified: snapshot.lastModified,
            mainNodeView: snapshot.mainNodeView,
            phases: snapshot.categories.phase,
            roles: snapshot.roles,
            title: snapshot.title,
            status: snapshot.status,
            tags: snapshot.tags,
            tasks: snapshot.tasks,
          };

          console.log('saving ' + activity);

          await this.bucket.put(activity, [owner, project.id], newSnapshot);
        }
      }
    }
  }

  private get bucket(): StorageService {
    if (!this._bucket) {
      this._bucket = new StorageService(this.ctx.env.BUCKET_SNAPSHOTS);
    }
    return this._bucket;
  }
}
