import { Context } from '../../config';
import { LibraryEntry } from '../../models';
import { BaseDataService } from './base.data-service';

export class LibraryEntryDataService extends BaseDataService {
  constructor(ctx: Context) {
    super(ctx);
  }

  async getByIdAsync(owner: string, entry: string): Promise<LibraryEntry | undefined> {
    const key = this.getKey(owner, entry);
    const kvData = await this.getKv<LibraryEntry>(key);

    if (kvData) return kvData;

    const data = await this.getFromOriginAsync(owner, entry);

    if (data) {
      this.putKv(this.getKey(owner, data.id), data);
      this.putKv(this.getKey(owner, data.recordId), data);
    }
    return data;
  }

  async refreshKvAsync(owner: string, id: string): Promise<void> {
    const data = await this.getFromOriginAsync(owner, id);

    if (!data) return;

    const idKey = this.getKey(owner, id);
    const recordIdKey = this.getKey(owner, data.recordId);

    this.putKv(idKey, data);
    this.putKv(recordIdKey, data);
  }

  async clearKvAsync(owner: string, id: string): Promise<void> {
    const keysToDelete = await this.ctx.env.KV_DATA.list({ prefix: this.getKey(owner, id) });

    for (const key of keysToDelete.keys) {
      this.clearKv(key.name);
    }
  }

  private getFromOriginAsync(owner: string, entry: string): Promise<LibraryEntry | undefined> {
    return this.origin.getAsync<LibraryEntry>(this.getBaseUrl(owner, entry));
  }

  private getBaseUrl(owner: string, entry: string): string {
    return `portfolio/${owner}/library/entries/${entry}`;
  }

  private getKey(owner: string, entry: string): string {
    return `PORTFOLIO|${owner}|LIBRARY|${entry}`;
  }
}
