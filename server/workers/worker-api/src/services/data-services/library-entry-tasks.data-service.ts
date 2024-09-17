import { Context } from '../../config';
import { LibraryEntryNode } from '../../models';
import { BaseDataService } from './base.data-service';

export class LibraryEntryTaskDataService extends BaseDataService {
  constructor(ctx: Context) {
    super(ctx);
  }

  async getAsync(owner: string, entry: string, version: number, visibility: string): Promise<LibraryEntryNode[] | undefined> {
    return visibility === 'private'
      ? await this.getPrivateTasksByVersionAsync(owner, entry, version)
      : await this.getPublicTasksByVersionAsync(owner, entry, version);
  }

  async getPrivateTasksByVersionAsync(owner: string, entry: string, version: number): Promise<LibraryEntryNode[] | undefined> {
    const key = this.getTasksKey(owner, entry, version, 'private');
    const kvData = await this.getKv<LibraryEntryNode[]>(key);

    if (kvData) return kvData;

    const tasks = await this.getTasksFromOriginAsync(owner, entry, version);
    this.putKv(key, tasks);
    return tasks;
  }

  async getPublicTasksByVersionAsync(owner: string, entry: string, version: number): Promise<LibraryEntryNode[] | undefined> {
    const key = this.getTasksKey(owner, entry, version, 'public');
    const kvData = await this.getKv<LibraryEntryNode[]>(key);

    if (kvData) return kvData;

    const tasks = await this.getTasksFromOriginAsync(owner, entry, version);
    const publicTasks = this.createPublicTasks(tasks);

    this.putKv(key, publicTasks);
    return publicTasks;
  }

  async refreshKvAsync(owner: string, entry: string, version: number): Promise<void> {
    const privateTasks = await this.getTasksFromOriginAsync(owner, entry, version);

    this.putKv(this.getTasksKey(owner, entry, version, 'private'), privateTasks);
    this.putKv(this.getTasksKey(owner, entry, version, 'public'), this.createPublicTasks(privateTasks));
  }

  private createPublicTasks(all: LibraryEntryNode[]): LibraryEntryNode[] {
    let hasSomePrivate = all.some((t) => t.visibility === 'private');
    //
    //  If there are no private tasks, we can cache and send them.
    //
    if (!hasSomePrivate) {
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

    return tasks;
  }

  private async getTasksFromOriginAsync(owner: string, entry: string, version: number): Promise<LibraryEntryNode[]> {
    return (await this.origin.getAsync<LibraryEntryNode[]>(this.getBaseUrl(owner, entry, version))) ?? [];
  }

  private getBaseUrl(owner: string, entry: string, version: number): string {
    return `portfolio/${owner}/library/entries/${entry}/versions/${version}/nodes`;
  }

  private getTasksKey(owner: string, entry: string, version: number, visibility: string): string {
    return `PORTFOLIO|${owner}|LIBRARY|${entry}|VERSION|${version}|TASKS|${visibility}`;
  }
}
