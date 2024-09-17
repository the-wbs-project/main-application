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

    const data = await this.origin.getAsync<LibraryEntryVersion[]>(`${this.getUrl(owner, entry)}/versions`);

    if (data) this.putKv(key, data);

    return data ?? [];
  }

  async getByIdAsync(owner: string, entryId: string, versionId: number): Promise<LibraryEntryVersion | undefined> {
    const key = this.getVersionKey(owner, entryId, versionId);
    const kvData = await this.getKv<LibraryEntryVersion>(key);

    if (kvData) return kvData;

    const data = await this.getVersionFromOriginAsync(owner, entryId, versionId);

    if (data) this.putKv(key, data);

    return data;
  }

  async publishAsync(owner: string, entry: string, version: number, data: LibraryEntryVersion): Promise<void> {
    const resp = await this.origin.putAsync(data, this.getUrl(owner, entry, version, 'publish'));

    if (resp.ok) {
      await this.clearKvAsync(owner, entry, 1);
    }
  }

  async clearKvAsync(owner: string, entry: string, version: number): Promise<void> {
    const keysToDelete = await this.ctx.env.KV_DATA.list({ prefix: this.getVersionKey(owner, entry, version) });

    for (const key of keysToDelete.keys) {
      this.clearKv(key.name);
    }
    //
    //  Remove from list
    //
    const versionsKey = this.getVersionsKey(owner, entry);
    const versions = ((await this.getKv<LibraryEntryVersion[]>(versionsKey)) ?? []).filter((x) => x.version !== version);

    this.putKv(versionsKey, versions);
  }

  async refreshKvAsync(owner: string, entry: string, version: number): Promise<void> {
    const listKey = this.getVersionsKey(owner, entry);
    const itemKey = this.getVersionKey(owner, entry, version);

    const data = await this.getVersionFromOriginAsync(owner, entry, version);

    if (!data) return;

    const versions = (await this.getKv<LibraryEntryVersion[]>(listKey)) ?? [];
    const index = versions.findIndex((x) => x.version === version);

    if (index === -1) {
      versions.push(data);
    } else {
      versions[index] = data;
    }

    this.putKv(listKey, versions);
    this.putKv(itemKey, data);
  }

  private getVersionFromOriginAsync(owner: string, entry: string, version: number): Promise<LibraryEntryVersion | undefined> {
    return this.origin.getAsync<LibraryEntryVersion>(this.getUrl(owner, entry, version));
  }

  private getUrl(owner: string, entry: string, version?: number, suffix?: string): string {
    const parts = [`portfolio/${owner}/library/entries/${entry}`];

    if (version) parts.push('versions', version.toString());
    if (suffix) parts.push(suffix);

    return parts.join('/');
  }

  private getVersionsKey(owner: string, entry: string): string {
    return `PORTFOLIO|${owner}|LIBRARY|${entry}|VERSIONS`;
  }

  private getVersionKey(owner: string, entry: string, version: number): string {
    return `PORTFOLIO|${owner}|LIBRARY|${entry}|VERSION|${version}`;
  }
}
