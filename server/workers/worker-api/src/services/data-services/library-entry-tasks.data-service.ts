import { Context } from '../../config';
import { LibraryEntryNode } from '../../models';
import { BaseDataService } from './base.data-service';

export class LibraryEntryTaskDataService extends BaseDataService {
  constructor(ctx: Context) {
    super(ctx);
  }

  async getPrivateTasksByVersionAsync(owner: string, entry: string, version: number): Promise<LibraryEntryNode[] | undefined> {
    return await this.getAllTasksAsync(owner, entry, version);
  }

  async clearKvAsync(owner: string, entry: string, version: number): Promise<void> {
    await Promise.all([
      this.clearVersionsAsync(owner, entry),
      this.clearVersionAsync(owner, entry, version),
      this.clearTasksAsync(owner, entry, version),
    ]);
  }

  async getPublicTasksByVersionAsync(owner: string, entry: string, version: number): Promise<LibraryEntryNode[] | undefined> {
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

  private getBaseUrl(owner: string, entry: string): string {
    return `portfolio/${owner}/library/entries/${entry}`;
  }

  private async clearVersionAsync(owner: string, entry: string, version: number): Promise<void> {
    await this.ctx.env.KV_DATA.delete(this.getVersionKey(owner, entry, version));
  }

  private async clearVersionsAsync(owner: string, entry: string): Promise<void> {
    await this.ctx.env.KV_DATA.delete(this.getVersionsKey(owner, entry));
  }

  private async clearTasksAsync(owner: string, entry: string, version: number): Promise<void> {
    await Promise.all([
      this.ctx.env.KV_DATA.delete(this.getTasksKey(owner, entry, version, 'public')),
      this.ctx.env.KV_DATA.delete(this.getTasksKey(owner, entry, version, 'private')),
    ]);
  }

  private getVersionsKey(owner: string, entry: string): string {
    return `PORTFOLIO|${owner}|LIBRARY|${entry}|VERSIONS`;
  }

  private getVersionKey(owner: string, entry: string, version: number): string {
    return `PORTFOLIO|${owner}|LIBRARY|${entry}|VERSION|${version}`;
  }

  private getTasksKey(owner: string, entry: string, version: number, visibility: string): string {
    return `PORTFOLIO|${owner}|LIBRARY|${entry}|VERSION|${version}|TASKS|${visibility}`;
  }
}
