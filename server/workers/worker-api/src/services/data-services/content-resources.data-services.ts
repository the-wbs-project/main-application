import { ReadableStream } from '@cloudflare/workers-types';
import { ContextLocal } from '../../config';
import { ContentResource } from '../../models';
import { BaseDataService } from './base.data-service';

export class ContentResourcesDataService extends BaseDataService {
  constructor(ctx: ContextLocal) {
    super(ctx);
  }

  async getListAsync(owner: string, parentId: string): Promise<ContentResource[]> {
    const key = this.getResourcesKey(owner, parentId);
    const kvData = await this.getKv<ContentResource[]>(key);

    if (kvData) return kvData;

    const data = await this.ctx.var.origin.getAsync<ContentResource[]>(this.getBaseUrl(owner, parentId));

    if (data) this.putKv(key, data);

    return data ?? [];
  }

  async getByIdAsync(owner: string, parentId: string, id: string): Promise<ContentResource | null> {
    const list = await this.getListAsync(owner, parentId);

    return list.find((x) => x.id === id) ?? null;
  }

  async getFileAsync(owner: string, parentId: string, id: string): Promise<ReadableStream<any> | null> {
    const key = this.getResourceFileKey(owner, parentId, id);

    const kvBody = await this.ctx.env.KV_DATA.get(key, 'stream');

    //if (kvBody) return kvBody;

    const resp = await this.origin.getResponseAsync(this.getFileUrl(owner, parentId, id));

    if (resp.status === 200 && resp.body) {
      this.ctx.env.KV_DATA.put(key, resp.body);
    }
    return resp.body;
  }

  async getFileResponseAsync(owner: string, parentId: string, id: string): Promise<Response> {
    const resp = await this.origin.getResponseAsync(this.getFileUrl(owner, parentId, id));

    return resp;
  }

  async clearKvAsync(owner: string, parentId: string): Promise<void> {
    const keys = await this.ctx.env.KV_DATA.list({ prefix: this.getResourcesKey(owner, parentId) });

    await Promise.all(keys.keys.map((key) => this.ctx.env.KV_DATA.delete(key.name)));
  }

  private getResourcesKey(owner: string, parentId: string): string {
    return `PORTFOLIO|${owner}|RESOURCES|${parentId}`;
  }

  private getResourceFileKey(owner: string, parentId: string, id: string): string {
    return `PORTFOLIO|${owner}|RESOURCES|${parentId}|${id}`;
  }

  private getBaseUrl(owner: string, parentId: string): string {
    return `portfolio/${owner}/content-resources/${parentId}`;
  }

  private getFileUrl(owner: string, parentId: string, id: string): string {
    return `portfolio/${owner}/content-resources/${parentId}/resource/${id}/file`;
  }
}
