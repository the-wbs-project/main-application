import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import {
  LibraryEntry,
  LibraryEntryNode,
  LibraryEntryVersion,
  ProjectCategory,
} from '@wbs/core/models';
import { Transformers } from '@wbs/core/services';
import { WbsNodeView } from '@wbs/core/view-models';
import { MetadataStore } from './metdata.store';

@Injectable({ providedIn: 'root' })
export class EntryStore {
  private transformer = inject(Transformers);
  private metadata = inject(MetadataStore);

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
    this._viewModels.set(
      this.createViewModels(entry.type, version.disciplines, tasks)
    );
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
    const version = this._version();

    if (entry && version)
      this._viewModels.set(
        this.createViewModels(entry.type, version.disciplines, tasks)
      );
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

  private createViewModels(
    entryType: string,
    disciplines: ProjectCategory[],
    tasks: LibraryEntryNode[]
  ): WbsNodeView[] {
    if (disciplines.length === 0)
      disciplines = this.metadata.categories.disciplines;

    return this.transformer.nodes.phase.view.run(tasks, entryType, disciplines);
  }
}
