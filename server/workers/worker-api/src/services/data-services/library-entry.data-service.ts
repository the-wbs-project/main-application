import { Context } from '../../config';
import { LibraryEntry, LibraryEntryNode, LibraryEntryVersion } from '../../models';
import { BaseDataService } from './base.data-service';

export class LibraryEntryDataService extends BaseDataService {
  constructor(ctx: Context) {
    super(ctx);
  }

  async getEntryByIdAsync(owner: string, entry: string): Promise<LibraryEntry | undefined> {
    const key = this.getEntryKey(owner, entry);
    const kvData = await this.getKv<LibraryEntry>(key);

    if (kvData) return kvData;

    const data = await this.origin.getAsync<LibraryEntry>(this.getBaseUrl(owner, entry));

    if (data) this.putKv(key, data);

    return data;
  }

  async getVersionByIdAsync(owner: string, entry: string, version: number): Promise<LibraryEntryVersion | undefined> {
    const key = this.getVersionKey(owner, entry, version);
    const kvData = await this.getKv<LibraryEntryVersion>(key);

    if (kvData) return kvData;

    const data = await this.origin.getAsync<LibraryEntryVersion>(`${this.getBaseUrl(owner, entry)}/versions/${version}`);

    if (data) this.putKv(key, data);

    return data;
  }

  async getPrivateTasksByVersionAsync(owner: string, entry: string, version: number): Promise<LibraryEntryNode[] | undefined> {
    return await this.getAllTasksAsync(owner, entry, version);
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

  private async getAllTasksAsync(owner: string, entry: string, version: number): Promise<LibraryEntryNode[] | undefined> {
    const key = this.getTasksKey(owner, entry, version, 'private');
    const kvData = await this.getKv<LibraryEntryNode[]>(key);

    if (kvData) return kvData;

    const data = await this.origin.getAsync<LibraryEntryNode[]>(`${this.getBaseUrl(owner, entry)}/versions/${version}/nodes`);

    if (data) {
      this.putKv(key, data);
    }

    return data;
  }

  public async getPublicTasksByVersionAsync(owner: string, entry: string, version: number): Promise<LibraryEntryNode[] | undefined> {
    const key = this.getTasksKey(owner, entry, version, 'public');
    const kvData = await this.getKv<LibraryEntryNode[]>(key);

    if (kvData) return kvData;

    const all = (await this.getAllTasksAsync(owner, entry, version)) ?? [];
    let hasSomePrivate = all.some((t) => t.visibility === 'private');
    //
    //  If there are no private tasks, we can cache and send them.
    //
    if (!hasSomePrivate) {
      this.putKv(key, all);
      return all;
    }
    const tasks: LibraryEntryNode[] = [];
    const addChildren = (taskId: string) => {
      const children = all.filter((t) => t.parentId === taskId && t.visibility !== 'private');

      for (const child of children) {
        tasks.push(child);
        addChildren(child.id);
      }
    };

    for (const task of all.filter((t) => !t.parentId)) {
      tasks.push(task);
      addChildren(task.id);
    }

    this.putKv(key, tasks);
    return tasks;
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
    await Promise.all([
      this.ctx.env.KV_DATA.delete(this.getTasksKey(owner, entry, version, 'public')),
      this.ctx.env.KV_DATA.delete(this.getTasksKey(owner, entry, version, 'private')),
    ]);
  }

  private getEntryKey(owner: string, entry: string): string {
    return `PORTFOLIO|${owner}|LIBRARY|${entry}|ENTRY`;
  }

  private getVersionKey(owner: string, entry: string, version: number): string {
    return `PORTFOLIO|${owner}|LIBRARY|${entry}|VERSION|${version}`;
  }

  private getTasksKey(owner: string, entry: string, version: number, visibility: string): string {
    return `PORTFOLIO|${owner}|LIBRARY|${entry}|VERSION|${version}|TASKS|${visibility}`;
  }
}
