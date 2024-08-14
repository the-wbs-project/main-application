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

    const data = await this.origin.getAsync<LibraryEntry>(this.getBaseUrl(owner, entry));

    if (data) this.putKv(key, data);

    return data;
  }

  async clearKvAsync(owner: string, entry: string): Promise<void> {
    await this.ctx.env.KV_DATA.delete(this.getKey(owner, entry));
  }

  private getBaseUrl(owner: string, entry: string): string {
    return `portfolio/${owner}/library/entries/${entry}`;
  }

  private getKey(owner: string, entry: string): string {
    return `PORTFOLIO|${owner}|LIBRARY|${entry}`;
  }
}
