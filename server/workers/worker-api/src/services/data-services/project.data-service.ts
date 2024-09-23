import { ContextLocal } from '../../config';
import { Project } from '../../models';
import { BaseDataService } from './base.data-service';

export class ProjectDataService extends BaseDataService {
  constructor(ctx: ContextLocal) {
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

    const data = await this.getFromOriginAsync(owner, id);

    if (data) {
      this.putKv(this.getKey(owner, data.id), data);
      this.putKv(this.getKey(owner, data.recordId), data);
    }
    return data;
  }

  async refreshKvAsync(owner: string, id: string): Promise<void> {
    const listKey = this.getListKey(owner);
    const itemKey = this.getKey(owner, id);

    const data = await this.getFromOriginAsync(owner, id);

    if (!data) return;

    const projects = (await this.getKv<Project[]>(listKey)) ?? [];
    const index = projects.findIndex((x) => x.id === id);

    if (index === -1) {
      projects.push(data);
    } else {
      projects[index] = data;
    }

    this.putKv(listKey, projects);
    this.putKv(itemKey, data);
  }

  async clearKvAsync(owner: string, id: string): Promise<void> {
    const keysToDelete = await this.ctx.env.KV_DATA.list({ prefix: this.getKey(owner, id) });

    for (const key of keysToDelete.keys) {
      this.clearKv(key.name);
    }
    //
    //  Remove from list
    //
    var projects = (await this.getKv<Project[]>(this.getListKey(owner))) ?? [];

    projects = projects.filter((x) => x.id !== id);

    this.putKv(this.getListKey(owner), projects);
  }

  private getFromOriginAsync(owner: string, id: string): Promise<Project | undefined> {
    return this.origin.getAsync<Project>(this.getUrl(owner, id));
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
