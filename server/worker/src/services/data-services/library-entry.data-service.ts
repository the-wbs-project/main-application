import { Context } from '../../config';
import { LibraryEntry, LibraryEntryNode, LibraryEntryVersion } from '../../models';
import { OriginService } from '../origin.service';

export class LibraryEntryDataService {
  constructor(private readonly ctx: Context) {}

  private get origin(): OriginService {
    return this.ctx.get('origin');
  }

  async getEntryByIdAsync(owner: string, entry: string): Promise<LibraryEntry | undefined> {
    const key = this.getEntryKey(owner, entry);
    const kvData = await this.ctx.env.KV_DATA.get<LibraryEntry>(key, 'json');

    if (kvData) return kvData;

    const data = await this.origin.getAsync<LibraryEntry>(this.getBaseUrl(owner, entry));

    if (data) {
      this.ctx.executionCtx.waitUntil(this.ctx.env.KV_DATA.put(key, JSON.stringify(data)));
    }

    return data;
  }

  async getVersionByIdAsync(owner: string, entry: string, version: number): Promise<LibraryEntryVersion | undefined> {
    const key = this.getVersionKey(owner, entry, version);
    const kvData = await this.ctx.env.KV_DATA.get<LibraryEntryVersion>(key, 'json');

    if (kvData) return kvData;

    const data = await this.origin.getAsync<LibraryEntryVersion>(`${this.getBaseUrl(owner, entry)}/versions/${version}`);

    if (data) {
      this.ctx.executionCtx.waitUntil(this.ctx.env.KV_DATA.put(key, JSON.stringify(data)));
    }

    return data;
  }

  async getTasksByVersionAsync(owner: string, entry: string, version: number): Promise<LibraryEntryNode[] | undefined> {
    const key = this.getTasksKey(owner, entry, version);
    const kvData = await this.ctx.env.KV_DATA.get<LibraryEntryNode[]>(key, 'json');

    if (kvData) return kvData;

    const data = await this.origin.getAsync<LibraryEntryNode[]>(`${this.getBaseUrl(owner, entry)}/versions/${version}/nodes`);

    if (data) {
      this.ctx.executionCtx.waitUntil(this.ctx.env.KV_DATA.put(key, JSON.stringify(data)));
    }

    return data;
  }

  async putEntryAsync(owner: string, entry: string, data: LibraryEntry): Promise<void> {
    await Promise.all([this.origin.putAsync(data, this.getBaseUrl(owner, entry)), this.clearEntryAsync(owner, entry)]);
  }

  async putVersionAsync(owner: string, entry: string, version: number, data: LibraryEntryVersion): Promise<void> {
    await Promise.all([
      this.origin.putAsync(data, `${this.getBaseUrl(owner, entry)}/versions/${version}`),
      this.clearEntryAsync(owner, entry),
      this.clearVersionAsync(owner, entry, version),
    ]);
  }

  async putTasksAsync(owner: string, entry: string, version: number, data: any): Promise<void> {
    await Promise.all([
      this.origin.putAsync(data, `${this.getBaseUrl(owner, entry)}/versions/${version}/nodes`),
      this.clearEntryAsync(owner, entry),
      this.clearVersionAsync(owner, entry, version),
      this.clearTasksAsync(owner, entry, version),
    ]);
  }

  async getEditorsAsync(owner: string, entry: string): Promise<string[]> {
    return (await this.origin.getAsync<string[]>(`portfolio/${owner}/library/entries/${entry}/editors`)) ?? [];
  }

  private getBaseUrl(owner: string, entry: string): string {
    return `portfolio/${owner}/library/entries/${entry}`;
  }

  private async clearEntryAsync(owner: string, entry: string): Promise<void> {
    console.log('clearEntryAsync', owner, entry);
    await this.ctx.env.KV_DATA.delete(this.getEntryKey(owner, entry));
  }

  private async clearVersionAsync(owner: string, entry: string, version: number): Promise<void> {
    console.log('clearVersionAsync', owner, entry, version);
    await this.ctx.env.KV_DATA.delete(this.getVersionKey(owner, entry, version));
  }

  private async clearTasksAsync(owner: string, entry: string, version: number): Promise<void> {
    console.log('clearTasksAsync', owner, entry, version);
    await this.ctx.env.KV_DATA.delete(this.getTasksKey(owner, entry, version));
  }

  private getEntryKey(owner: string, entry: string): string {
    return `PORTFOLIO|${owner}|LIBRARY|${entry}|ENTRY`;
  }

  private getVersionKey(owner: string, entry: string, version: number): string {
    return `PORTFOLIO|${owner}|LIBRARY|${entry}|VERSION|${version}`;
  }

  private getTasksKey(owner: string, entry: string, version: number): string {
    return `PORTFOLIO|${owner}|LIBRARY|${entry}|VERSION|${version}|TASKS`;
  }
}
