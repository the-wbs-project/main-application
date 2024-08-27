import { Context } from '../../config';
import { LibraryEntryVersion } from '../../models';
import { BaseDataService } from './base.data-service';

export class LibraryEntryVersionDataService extends BaseDataService {
  constructor(ctx: Context) {
    super(ctx);
  }

  async getAsync(owner: string, entry: string): Promise<LibraryEntryVersion[]> {
    const key = this.getVersionsKey(owner, entry);
    const kvData = await this.getKv<LibraryEntryVersion[]>(key);

    if (kvData) return kvData;

    const data = await this.origin.getAsync<LibraryEntryVersion[]>(`${this.getBaseUrl(owner, entry)}/versions`);

    if (data) this.putKv(key, data);

    return data ?? [];
  }

  async getByIdAsync(owner: string, entryId: string, versionId: number): Promise<LibraryEntryVersion | undefined> {
    const versions = await this.getAsync(owner, entryId);

    return versions.find((v) => v.version === versionId);
  }

  async publishAsync(owner: string, entry: string, version: number, data: LibraryEntryVersion): Promise<void> {
    await Promise.all([
      this.origin.putAsync(data, `${this.getBaseUrl(owner, entry)}/versions/${version}/publish`),
      this.clearKvAsync(owner, entry),
    ]);
  }

  async clearKvAsync(owner: string, entry: string): Promise<void> {
    await this.ctx.env.KV_DATA.delete(this.getVersionsKey(owner, entry));
  }

  private getBaseUrl(owner: string, entry: string): string {
    return `portfolio/${owner}/library/entries/${entry}`;
  }

  private getVersionsKey(owner: string, entry: string): string {
    return `PORTFOLIO|${owner}|LIBRARY|${entry}|VERSIONS`;
  }
}
