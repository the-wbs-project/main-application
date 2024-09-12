import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import {
  PROJECT_CLAIMS,
  PROJECT_STATI,
  ProjectApproval,
  ProjectApprovalStats,
  ProjectNode,
} from '@wbs/core/models';
import { CategoryService, Transformers } from '@wbs/core/services';
import { MembershipStore } from '@wbs/core/store';
import {
  CategoryViewModel,
  ProjectTaskViewModel,
  ProjectViewModel,
} from '@wbs/core/view-models';

@Injectable({ providedIn: 'root' })
export class ProjectStore {
  private readonly categories = inject(CategoryService);
  private readonly transformers = inject(Transformers);
  private readonly membership = inject(MembershipStore);

  private readonly _disciplines = signal<CategoryViewModel[]>([]);
  private readonly _project = signal<ProjectViewModel | undefined>(undefined);
  private readonly _taskModels = signal<ProjectNode[] | undefined>(undefined);
  private readonly _absTasks = signal<ProjectTaskViewModel[] | undefined>(
    undefined
  );
  private readonly _tasks = signal<ProjectTaskViewModel[] | undefined>(
    undefined
  );
  private readonly _claims = signal<string[]>([]);

  get absTasks(): Signal<ProjectTaskViewModel[] | undefined> {
    return this._absTasks;
  }

  get claims(): Signal<string[]> {
    return this._claims;
  }

  get isApprovalEnabled(): Signal<boolean> {
    return this.membership.projectApprovalRequired;
  }

  get project(): Signal<ProjectViewModel | undefined> {
    return this._project;
  }

  get projectDisciplines(): Signal<CategoryViewModel[]> {
    return this._disciplines;
  }

  get tasks(): Signal<ProjectNode[] | undefined> {
    return this._taskModels;
  }

  get viewModels(): Signal<ProjectTaskViewModel[] | undefined> {
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

  getTask(taskId: Signal<string>): Signal<ProjectTaskViewModel | undefined> {
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
    this._disciplines.set(
      project.disciplines.length > 0
        ? this.categories.buildViewModels(project.disciplines)
        : this.categories.buildViewModelsFromDefinitions()
    );
  }

  markProject(project: ProjectViewModel): void {
    project.lastModified = new Date();

    this._project.set(structuredClone(project));
  }

  setTasks(tasks: ProjectNode[]): void {
    this._taskModels.set(structuredClone(tasks));
    this.rebuildNodeViews();
  }

  resetTasks(): void {
    this.setTasks(structuredClone(this.tasks() ?? []));
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
    const disciplines = this.projectDisciplines();

    if (!project || !tasks) return;

    this._tasks.set(
      this.transformers.nodes.phase.view.forProject(tasks, disciplines)
    );
    this._absTasks.set(
      this.transformers.nodes.phase.view.forAbsProject(tasks, disciplines)
    );
  }

  private runStats(list: ProjectApproval[]): ProjectApprovalStats {
    const total = list.length;
    const approved = list.filter((a) => a.isApproved === true).length;
    const rejected = list.filter((a) => a.isApproved === false).length;
    const remaining = list.filter((a) => a.isApproved == undefined).length;

    return {
      approved,
      approvedPercent: Math.round((approved / total) * 100),
      rejected,
      rejectedPercent: Math.round((rejected / total) * 100),
      remaining,
      remainingPercent: Math.round((remaining / total) * 100),
      total,
    };
  }
}
