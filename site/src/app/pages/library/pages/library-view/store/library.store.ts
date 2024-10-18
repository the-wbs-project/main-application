import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import {
  LIBRARY_CLAIMS,
  LibraryEntryNode,
  LibraryEntryVersionBasic,
} from '@wbs/core/models';
import { CategoryService, Transformers } from '@wbs/core/services';
import {
  CategoryViewModel,
  LibraryTaskViewModel,
  LibraryVersionViewModel,
} from '@wbs/core/view-models';

@Injectable({ providedIn: 'root' })
export class LibraryStore {
  private readonly categoryService = inject(CategoryService);
  private readonly transformer = inject(Transformers);

  private readonly _disciplines = signal<CategoryViewModel[]>([]);
  private readonly _versions = signal<LibraryEntryVersionBasic[] | undefined>(
    undefined
  );
  private readonly _version = signal<LibraryVersionViewModel | undefined>(
    undefined
  );
  private readonly _tasks = signal<LibraryEntryNode[] | undefined>(undefined);
  private readonly _viewModels = signal<LibraryTaskViewModel[] | undefined>(
    undefined
  );
  private readonly _claims = signal<string[]>([]);

  get tasks(): Signal<LibraryEntryNode[] | undefined> {
    return this._tasks;
  }

  get version(): Signal<LibraryVersionViewModel | undefined> {
    return this._version;
  }

  get versionDisciplines(): Signal<CategoryViewModel[]> {
    return this._disciplines;
  }

  get versions(): Signal<LibraryEntryVersionBasic[] | undefined> {
    return this._versions;
  }

  get viewModels(): Signal<LibraryTaskViewModel[] | undefined> {
    return this._viewModels;
  }

  get claims(): Signal<string[]> {
    return this._claims;
  }

  get canEditEntry(): Signal<boolean> {
    return computed(() =>
      this.claimStatusCheck(
        this.version(),
        this._claims(),
        LIBRARY_CLAIMS.UPDATE
      )
    );
  }

  get canEditAlias(): Signal<boolean> {
    return computed(() =>
      this.claimCheck(this._claims(), LIBRARY_CLAIMS.UPDATE)
    );
  }

  get canCreateTask(): Signal<boolean> {
    return computed(() =>
      this.claimStatusCheck(
        this.version(),
        this._claims(),
        LIBRARY_CLAIMS.TASKS.CREATE
      )
    );
  }

  get canUpdateTasks(): Signal<boolean> {
    return computed(() =>
      this.claimStatusCheck(
        this.version(),
        this._claims(),
        LIBRARY_CLAIMS.TASKS.UPDATE
      )
    );
  }

  get canDeleteTask(): Signal<boolean> {
    return computed(() =>
      this.claimStatusCheck(
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
    versions: LibraryEntryVersionBasic[],
    version: LibraryVersionViewModel,
    tasks: LibraryEntryNode[],
    claims: string[]
  ): void {
    this.setVersions(versions);
    this.setVersion(version);
    this.setClaims(claims);
    this.setTasks(tasks);
  }

  setVersion(version: LibraryVersionViewModel): void {
    this._version.set({ ...version });
    this._disciplines.set(this.getDisciplines(version));
    this._versions.update((list) => {
      const basic = list?.find((x) => x.version === version.version);

      if (basic) {
        basic.versionAlias = version.versionAlias ?? '';
        basic.title = version.title ?? '';
        basic.status = version.status ?? '';
      }
      return [...(list ?? [])];
    });
  }

  setVersions(versions: LibraryEntryVersionBasic[]): void {
    this._versions.set(structuredClone(versions));
  }

  setTasks(tasks: LibraryEntryNode[]): void {
    this._tasks.set([...tasks]);

    const version = this._version();

    if (!version) return;

    this._viewModels.set(this.createViewModels(version, tasks));
  }

  setClaims(claims: string[]): void {
    this._claims.set(claims);
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
    this._version.update((v) =>
      v ? { ...v, lastModified: new Date() } : undefined
    );
  }

  private getDisciplines(
    version: LibraryVersionViewModel
  ): CategoryViewModel[] {
    return version.disciplines.length > 0
      ? this.categoryService.buildViewModels(version.disciplines)
      : this.categoryService.buildViewModelsFromDefinitions();
  }

  private createViewModels(
    version: LibraryVersionViewModel,
    tasks: LibraryEntryNode[]
  ): LibraryTaskViewModel[] {
    return this.transformer.nodes.phase.view.forLibrary(
      version,
      tasks,
      this.versionDisciplines()
    );
  }

  private claimStatusCheck(
    version: LibraryVersionViewModel | undefined,
    claims: string[],
    claim: string
  ): boolean {
    return version?.status === 'draft' && this.claimCheck(claims, claim);
  }

  private claimCheck(claims: string[], claim: string): boolean {
    return claims.includes(claim);
  }
}
