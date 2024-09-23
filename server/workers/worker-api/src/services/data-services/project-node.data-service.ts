import { ContextLocal } from '../../config';
import { BaseDataService } from './base.data-service';

export class ProjectNodeDataService extends BaseDataService {
  constructor(ctx: ContextLocal) {
    super(ctx);
  }

  async getAsync(owner: string, id: string): Promise<any[]> {
    const key = this.getKey(owner, id);
    const kvData = await this.getKv<any>(key);

    if (kvData) return kvData;

    const data = await this.getFromOriginAsync(owner, id);

    if (data) this.putKv(this.getKey(owner, id), data);

    return data ?? [];
  }

  async refreshKvAsync(owner: string, id: string): Promise<void> {
    const data = await this.getFromOriginAsync(owner, id);

    if (data) this.putKv(this.getKey(owner, id), data);
    else this.clearKv(this.getKey(owner, id));
  }

  private getFromOriginAsync(owner: string, id: string): Promise<any[] | undefined> {
    return this.origin.getAsync<any[]>(this.getUrl(owner, id));
  }

  private getUrl(owner: string, projectId?: string): string {
    return `portfolio/${owner}/projects/${projectId}/nodes`;
  }

  private getKey(owner: string, projectId: string): string {
    return `PORTFOLIO|${owner}|PROJECT|${projectId}|NODES`;
  }
}
