import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import {
  LIBRARY_CLAIMS,
  LibraryEntry,
  LibraryEntryNode,
  LibraryEntryVersion,
  ProjectCategory,
} from '@wbs/core/models';
import { CategoryService, Transformers } from '@wbs/core/services';
import { LibraryTaskViewModel } from '@wbs/core/view-models';

@Injectable({ providedIn: 'root' })
export class EntryStore {
  private readonly categoryService = inject(CategoryService);
  private readonly transformer = inject(Transformers);

  private readonly _entry = signal<LibraryEntry | undefined>(undefined);
  private readonly _version = signal<LibraryEntryVersion | undefined>(
    undefined
  );
  private readonly _tasks = signal<LibraryEntryNode[] | undefined>(undefined);
  private readonly _viewModels = signal<LibraryTaskViewModel[] | undefined>(
    undefined
  );
  private readonly _navSectionEntry = signal<string | undefined>(undefined);
  private readonly _navSectionTask = signal<string | undefined>(undefined);
  private readonly _claims = signal<string[]>([]);

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

  get viewModels(): Signal<LibraryTaskViewModel[] | undefined> {
    return this._viewModels;
  }

  get claims(): Signal<string[]> {
    return this._claims;
  }

  get canEditEntry(): Signal<boolean> {
    return computed(() =>
      this.claimCheck(this.version(), this._claims(), LIBRARY_CLAIMS.UPDATE)
    );
  }

  get canCreateTask(): Signal<boolean> {
    return computed(() =>
      this.claimCheck(
        this.version(),
        this._claims(),
        LIBRARY_CLAIMS.TASKS.CREATE
      )
    );
  }

  get canEditTask(): Signal<boolean> {
    return computed(() =>
      this.claimCheck(
        this.version(),
        this._claims(),
        LIBRARY_CLAIMS.TASKS.UPDATE
      )
    );
  }

  get canDeleteTask(): Signal<boolean> {
    return computed(() =>
      this.claimCheck(
        this.version(),
        this._claims(),
        LIBRARY_CLAIMS.TASKS.DELETE
      )
    );
  }

  getTask(taskId: Signal<string>): Signal<LibraryTaskViewModel | undefined> {
    return computed(() => this.viewModels()?.find((t) => t.id === taskId()));
  }

  setAll(
    entry: LibraryEntry,
    version: LibraryEntryVersion,
    tasks: LibraryEntryNode[],
    claims: string[]
  ): void {
    this._entry.set(entry);
    this._version.set(version);
    this._tasks.set(tasks);
    this._claims.set(claims);
    this._viewModels.set(
      this.createViewModels(entry, version.disciplines, tasks)
    );
  }

  setNavSectionEntry(value: string): void {
    this._navSectionEntry.set(value);
  }

  setNavSectionTask(value: string): void {
    this._navSectionTask.set(value);
  }

  setEntry(entry: LibraryEntry): void {
    this._entry.set({ ...entry });
  }

  setVersion(version: LibraryEntryVersion): void {
    this._version.set({ ...version });
  }

  setTasks(tasks: LibraryEntryNode[]): void {
    this._tasks.set([...tasks]);

    const entry = this._entry();
    const version = this._version();

    if (entry && version)
      this._viewModels.set(
        this.createViewModels(entry, version.disciplines, tasks)
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
    entry: LibraryEntry,
    disciplines: ProjectCategory[],
    tasks: LibraryEntryNode[]
  ): LibraryTaskViewModel[] {
    return this.transformer.nodes.phase.view.forLibrary(
      entry,
      tasks,
      disciplines.length > 0
        ? this.categoryService.buildViewModels(disciplines)
        : this.categoryService.buildViewModelsFromDefinitions()
    );
  }

  private claimCheck(
    version: LibraryEntryVersion | undefined,
    claims: string[],
    claim: string
  ): boolean {
    return version?.status === 'draft' && claims.includes(claim);
  }
}
