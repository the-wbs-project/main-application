import { Context } from '../../config';
import { Project } from '../../models';
import { BaseDataService } from './base.data-service';

export class ProjectDataService extends BaseDataService {
  constructor(ctx: Context) {
    super(ctx);
  }

  async getByOwnerAsync(owner: string): Promise<Project[]> {
    const key = this.getListKey(owner);
    const kvData = await this.getKv<Project[]>(key);

    if (kvData) return kvData;

    const data = await this.origin.getAsync<Project[]>(this.getUrl(owner));

    if (data) this.putKv(key, data);

    return data ?? [];
  }

  async getByIdAsync(owner: string, id: string): Promise<Project | undefined> {
    const key = this.getKey(owner, id);
    const kvData = await this.getKv<Project>(key);

    if (kvData) return kvData;

    const data = await this.origin.getAsync<Project>(this.getUrl(owner, id));

    if (data) {
      this.putKv(this.getKey(owner, data.id), data);
      this.putKv(this.getKey(owner, data.recordId), data);
    }
    return data;
  }

  async clearKvAsync(owner: string, id: string): Promise<void> {
    await Promise.all([
      this.ctx.env.KV_DATA.delete(this.getKey(owner, id)), //
      this.ctx.env.KV_DATA.delete(this.getListKey(owner)),
    ]);
  }

  private getUrl(owner: string, projectId?: string): string {
    const url = `portfolio/${owner}/projects`;

    return projectId ? `${url}/${projectId}` : url;
  }

  private getListKey(owner: string): string {
    return `PORTFOLIO|${owner}|PROJECTS`;
  }

  private getKey(owner: string, projectId: string): string {
    return `PORTFOLIO|${owner}|PROJECT|${projectId}`;
  }
}
