import { Env } from '../../config';
import { LibraryEntryVersion } from '../../models';
import { OriginService } from '../origin-services';
import { BaseDataService } from './base.data-service';

export class LibraryEntryVersionDataService extends BaseDataService {
  constructor(env: Env, executionCtx: ExecutionContext, origin: OriginService) {
    super(env, executionCtx, origin);
  }

  async getAsync(owner: string, entry: string): Promise<LibraryEntryVersion[]> {
    const key = this.getVersionsKey(owner, entry);
    const kvData = await this.getKv<LibraryEntryVersion[]>(key);

    if (kvData) return kvData;

    const data = await this.getVersionsFromOriginAsync(owner, entry);

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

  async refreshKvAsync(owner: string, entry: string): Promise<void> {
    const listKey = this.getVersionsKey(owner, entry);
    const ids = await this.getIdsFromKeysAsync(owner, entry);
    const list = (await this.getVersionsFromOriginAsync(owner, entry)) ?? [];

    for (const item of list) {
      const index = ids.findIndex((x) => x === item.version.toString());

      if (index > -1) {
        ids.splice(index, 1);
      }
      const itemKey = this.getVersionKey(owner, entry, item.version);

      this.putKv(itemKey, item);
    }
    //
    //  Remove any ids that are no longer in the list
    //
    for (const id of ids) {
      const itemKey = this.getVersionKey(owner, entry, id);

      this.clearKv(itemKey);
    }
    //
    //  Put the new list
    //
    this.putKv(listKey, list);
  }

  private getVersionsFromOriginAsync(owner: string, entry: string): Promise<LibraryEntryVersion[] | undefined> {
    return this.origin.getAsync<LibraryEntryVersion[]>(this.getUrl(owner, entry));
  }

  private getVersionFromOriginAsync(owner: string, entry: string, version: number): Promise<LibraryEntryVersion | undefined> {
    return this.origin.getAsync<LibraryEntryVersion>(this.getUrl(owner, entry, version));
  }

  private getUrl(owner: string, entry: string, version?: number, suffix?: string): string {
    const parts = [`portfolio/${owner}/library/entries/${entry}/versions`];

    if (version) parts.push(version.toString());
    if (suffix) parts.push(suffix);

    return parts.join('/');
  }

  private async getIdsFromKeysAsync(owner: string, entry: string): Promise<string[]> {
    const keys = await this.kv.list({ prefix: `PORTFOLIO|${owner}|LIBRARY|${entry}|VERSION|` });

    return keys.keys
      .map((x) => x.name.split('|'))
      .filter((x) => x.length === 6)
      .map((x) => x[5]);
  }

  private getVersionsKey(owner: string, entry: string): string {
    return `PORTFOLIO|${owner}|LIBRARY|${entry}|VERSIONS`;
  }

  private getVersionKey(owner: string, entry: string, version: number | string): string {
    return `PORTFOLIO|${owner}|LIBRARY|${entry}|VERSION|${version}`;
  }
}
