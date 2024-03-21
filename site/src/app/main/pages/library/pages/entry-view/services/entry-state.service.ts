import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import {
  LibraryEntry,
  LibraryEntryNode,
  LibraryEntryVersion,
} from '@wbs/core/models';
import { WbsNodeView } from '@wbs/core/view-models';
import { Transformers } from '@wbs/main/services';

@Injectable()
export class EntryState {
  private transformer = inject(Transformers);

  private _entry = signal<LibraryEntry | undefined>(undefined);
  private _version = signal<LibraryEntryVersion | undefined>(undefined);
  private _tasks = signal<LibraryEntryNode[] | undefined>(undefined);
  private _viewModels = signal<WbsNodeView[] | undefined>(undefined);
  private _navSectionEntry = signal<string | undefined>(undefined);
  private _navSectionTask = signal<string | undefined>(undefined);

  get entry(): Signal<LibraryEntry | undefined> {
    return this._entry;
  }

  get navSectionEntry(): Signal<string | undefined> {
    return this._navSectionEntry;
  }

  get navSectionTask(): Signal<string | undefined> {
    return this._navSectionTask;
  }

  get tasks(): Signal<LibraryEntryNode[] | undefined> {
    return this._tasks;
  }

  get version(): Signal<LibraryEntryVersion | undefined> {
    return this._version;
  }

  get viewModels(): Signal<WbsNodeView[] | undefined> {
    return this._viewModels;
  }

  getTask(taskId: Signal<string>): Signal<WbsNodeView | undefined> {
    return computed(() => this.viewModels()?.find((t) => t.id === taskId()));
  }

  setAll(
    entry: LibraryEntry,
    version: LibraryEntryVersion,
    tasks: LibraryEntryNode[]
  ): void {
    this._entry.set(entry);
    this._version.set(version);
    this._tasks.set(tasks);
    this._viewModels.set(this.createViewModels(entry.type, tasks));
  }

  setNavSectionEntry(value: string): void {
    this._navSectionEntry.set(value);
  }

  setNavSectionTask(value: string): void {
    this._navSectionTask.set(value);
  }

  setEntry(entry: LibraryEntry): void {
    this._entry.set(entry);
  }

  setVersion(version: LibraryEntryVersion): void {
    this._version.set(version);
  }

  setTasks(tasks: LibraryEntryNode[]): void {
    this._tasks.set(tasks);

    const entry = this._entry();

    if (entry) this._viewModels.set(this.createViewModels(entry.type, tasks));
  }

  tasksChanged(upserts: LibraryEntryNode[], removeIds?: string[]): void {
    const list = structuredClone(this.tasks() ?? []);

    if (removeIds)
      for (const id of removeIds) {
        const index = list.findIndex((x) => x.id === id);

        if (index > -1) list.splice(index, 1);
      }

    for (const node of upserts) {
      const index = list.findIndex((x) => x.id === node.id);

      if (index === -1) list.push(node);
      else list[index] = node;
    }
    this.setTasks(list);
  }

  /* setEntry(
    owner: string,
    entryId: string,
    versionId: number
  ): Observable<void> {
    return forkJoin({
      entry: this.data.libraryEntries.getAsync(owner, entryId),
      version: this.data.libraryEntryVersions.getAsync(
        owner,
        entryId,
        versionId
      ),
      tasks: this.data.libraryEntryNodes.getAllAsync(owner, entryId, versionId),
    }).pipe(
      map(({ entry, version, tasks }) => {
        this._entry.set(entry);
        this._version.set(version);
        this._tasks.set(tasks);
        this._viewModels.set(this.createViewModels(entry.type, tasks));
      })
    );
  }

  entryChanged(entry }: EntryChanged): void {
    ctx.patchState({ entry: structuredClone(entry) });
  }

  @Action(VersionChanged)
  versionChanged(ctx: Context, { version }: VersionChanged): void {
    ctx.patchState({ version: structuredClone(version) });
  }

  @Action(TasksChanged)
  tasksChanged(ctx: Context, { upserts, removeIds }: TasksChanged): void {
    const list = structuredClone(ctx.getState().tasks ?? []);

    if (removeIds)
      for (const id of removeIds) {
        const index = list.findIndex((x) => x.id === id);

        if (index > -1) list.splice(index, 1);
      }

    for (const node of upserts) {
      const index = list.findIndex((x) => x.id === node.id);

      if (index === -1) list.push(node);
      else list[index] = node;
    }

    ctx.patchState({ tasks: list });

    this.rebuildViewModels(ctx);
  }*/

  private createViewModels(
    entryType: string,
    tasks: LibraryEntryNode[]
  ): WbsNodeView[] {
    return this.transformer.nodes.phase.view.runv2(tasks, entryType);
  }
}
