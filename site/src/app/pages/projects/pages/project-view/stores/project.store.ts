import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { PROJECT_CLAIMS, PROJECT_STATI, ProjectNode } from '@wbs/core/models';
import { Transformers } from '@wbs/core/services';
import {
  LibraryTaskViewModel,
  ProjectTaskViewModel,
  ProjectViewModel,
} from '@wbs/core/view-models';

@Injectable({ providedIn: 'root' })
export class ProjectStore {
  private readonly transformers = inject(Transformers);

  private readonly _project = signal<ProjectViewModel | undefined>(undefined);
  private readonly _taskModels = signal<ProjectNode[] | undefined>(undefined);
  private readonly _absTasks = signal<ProjectTaskViewModel[] | undefined>(
    undefined
  );
  private readonly _tasks = signal<ProjectTaskViewModel[] | undefined>(
    undefined
  );
  private readonly _claims = signal<string[]>([]);

  get claims(): Signal<string[]> {
    return this._claims;
  }

  get project(): Signal<ProjectViewModel | undefined> {
    return this._project;
  }

  get tasks(): Signal<ProjectNode[] | undefined> {
    return this._taskModels;
  }

  get viewModels(): Signal<LibraryTaskViewModel[] | undefined> {
    return this._tasks;
  }

  get canEditProject(): Signal<boolean> {
    return computed(() =>
      this.claimStatusCheck(
        this.project(),
        this._claims(),
        PROJECT_CLAIMS.UPDATE
      )
    );
  }

  get canCreateTasks(): Signal<boolean> {
    return computed(() =>
      this.claimStatusCheck(
        this.project(),
        this._claims(),
        PROJECT_CLAIMS.TASKS.CREATE
      )
    );
  }

  get canEditTasks(): Signal<boolean> {
    return computed(() =>
      this.claimStatusCheck(
        this.project(),
        this._claims(),
        PROJECT_CLAIMS.TASKS.UPDATE
      )
    );
  }

  get canDeleteTasks(): Signal<boolean> {
    return computed(() =>
      this.claimStatusCheck(
        this.project(),
        this._claims(),
        PROJECT_CLAIMS.TASKS.DELETE
      )
    );
  }

  getTask(taskId: Signal<string>): Signal<LibraryTaskViewModel | undefined> {
    return computed(() => this.viewModels()?.find((t) => t.id === taskId()));
  }

  setAll(
    project: ProjectViewModel,
    tasks: ProjectNode[],
    claims: string[]
  ): void {
    this.setProject(project);
    this.setTasks(tasks);
    this._claims.set(claims);
  }

  setProject(project: ProjectViewModel): void {
    this._project.set(structuredClone(project));
  }

  markProject(): void {
    this._project.update((v) => {
      if (!v) return v;
      v.lastModified = new Date();

      return { ...v };
    });
  }

  setTasks(tasks: ProjectNode[]): void {
    this._taskModels.set(structuredClone(tasks));
    this.rebuildNodeViews();
  }

  tasksChanged(upserts: ProjectNode[], removeIds?: string[]): void {
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
    this._project.update((v) =>
      v ? { ...v, lastModified: new Date() } : undefined
    );
  }

  private claimStatusCheck(
    project: ProjectViewModel | undefined,
    claims: string[],
    claim: string
  ): boolean {
    return (
      project?.status === PROJECT_STATI.PLANNING &&
      this.claimCheck(claims, claim)
    );
  }

  private claimCheck(claims: string[], claim: string): boolean {
    return claims.includes(claim);
  }

  private rebuildNodeViews(): void {
    const project = this.project();
    const tasks = this._taskModels();

    if (!project || !tasks) return;

    this._tasks.set(
      this.transformers.nodes.phase.view.forProject(tasks, project.disciplines)
    );
    this._absTasks.set(
      this.transformers.nodes.phase.view.forAbsProject(
        tasks,
        project.disciplines
      )
    );
  }
}
