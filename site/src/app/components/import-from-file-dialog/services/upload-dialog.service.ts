import { computed, inject, Injectable, signal } from '@angular/core';
import { FileInfo } from '@progress/kendo-angular-upload';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Category, WbsImportResult, WbsNode } from '@wbs/core/models';
import { sorter, Utils } from '@wbs/core/services';
import { MetadataStore } from '@wbs/core/store';
import { CategoryViewModel } from '@wbs/core/view-models';
import { Observable, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { ImportTask, ProjectPlanPerson } from '../models';

const EXTENSION_PAGES: Record<string, string> = {
  xlsx: 'excel',
  mpp: 'project',
};

@Injectable()
export class UploadDialogService {
  private readonly data = inject(DataServiceFactory);
  private readonly metadata = inject(MetadataStore);
  private readonly _originalTasks = signal<ImportTask[]>([]);

  readonly isLoadingFile = signal(false);
  readonly file = signal<FileInfo | null>(null);
  readonly extension = computed(() =>
    this.file()?.name.split('.').at(-1)!.toLowerCase()
  );
  readonly isFileSupported = computed(
    () => !!EXTENSION_PAGES[this.extension() ?? '']
  );
  readonly results = signal<WbsImportResult[] | undefined>(undefined);
  readonly peopleList = signal<ProjectPlanPerson[]>([]);
  readonly tasks = signal<ImportTask[]>([]);

  uploadFile(): Observable<undefined | { errors: string[] }> {
    this.isLoadingFile.set(true);

    const file = this.file();

    if (!file) {
      return of({ errors: ['File not found'] });
    }

    const extension = this.getFileExtension(file);

    return Utils.getFileAsync(file).pipe(
      switchMap((body) => this.data.wbsImport.runAsync(extension!, body)),
      map((uploadResults) => {
        this.isLoadingFile.set(false);
        this._originalTasks.set([]);
        this.tasks.set([]);
        this.peopleList.set([]);

        if (!uploadResults.results) uploadResults.results = [];

        const errors = uploadResults.errors ?? [];

        if (errors.length > 0) return { errors };

        this.results.set(uploadResults.results);

        if (this.extension() === 'mpp') {
          let people = uploadResults.results
            .flatMap((x) => x.resources)
            .filter((x) => !!x);

          this.peopleList.set(
            [...new Set(people)]
              .sort((a, b) => sorter(a, b))
              .map((x) => ({ name: x }))
          );
        } else {
          const tasks = this.convertNodes(uploadResults.results, undefined);
          this._originalTasks.set(structuredClone(tasks));
          this.tasks.set(tasks);
        }

        return undefined;
      })
      //catchError((err, caught) => [err.message])
    );
  }

  reload(): void {
    this.tasks.set(structuredClone(this._originalTasks()));
    this.resetDisciplines();
  }

  verifyTasks(): void {
    const tasks = this.tasks();

    if (tasks.length === 0) {
      const tasks = this.convertNodes(this.results() ?? [], undefined);
      this._originalTasks.set(structuredClone(tasks));
      this.tasks.set(tasks);
    } else {
      this.resetDisciplines();
    }
  }

  converTasksToSave(): WbsNode[] {
    const tasks = this.tasks();
    const nodes: WbsNode[] = [];

    for (const task of tasks) {
      const levels = task.levels.map(Number);

      nodes.push({
        id: task.id,
        title: task.title,
        lastModified: new Date(),
        order: levels.at(-1)!,
        parentId: task.parentId,
        disciplineIds: task.disciplines.map((x) => x.id),
      });
    }

    return nodes;
  }

  private resetDisciplines(): void {
    const disciplines = this.metadata.categories.disciplines;
    const people = this.peopleList();
    const tasks = this.tasks();

    for (const task of tasks) {
      for (const resource of task.resources) {
        const person = people.find((x) => x.name === resource.name);

        if (!person || resource.discipline == person.discipline) continue;
        //
        //  First remove the discipline the person was.
        //
        task.disciplines = task.disciplines.filter(
          (x) => x.id !== resource.discipline
        );
        //
        //  Then add the new discipline.
        //
        resource.discipline = person.discipline;

        if (person.discipline) {
          task.disciplines.push(
            this.getDiscipleFromId(disciplines, person.discipline)
          );
        }
      }
    }
    this.tasks.set(tasks);
  }

  private getFileExtension(file: FileInfo): string {
    const parts = file.name.split('.');
    return parts.at(-1)!.toLowerCase();
  }

  private convertNodes(
    items: WbsImportResult[],
    parent?: ImportTask
  ): ImportTask[] {
    if (this.extension() === 'xlsx') {
      return this.convertExcelNodes(items, parent);
    } else {
      return this.convertProjectNodes(items, parent);
    }
  }

  private convertExcelNodes(
    items: WbsImportResult[],
    parent?: ImportTask
  ): ImportTask[] {
    const disciplines = this.metadata.categories.disciplines;
    const nodes: ImportTask[] = [];
    let childLevel = 1;
    let keepLooking = true;

    while (keepLooking) {
      const levels = [...(parent?.levels ?? []), childLevel];
      const levelText = levels.join('.');
      const item = items.find((x) => x.levelText === levelText);

      if (item) {
        const node: ImportTask = {
          id: item.id,
          parentId: parent?.id,
          order: childLevel,
          levelText: levelText,
          levels: levels,
          title: item.title,
          childrenIds: [],
          resources: [],
          disciplines: [],
          canMoveLeft: parent != null,
          canMoveRight: childLevel > 1,
          canMoveUp: childLevel > 1,
          canMoveDown: true,
        };
        if (item.resources)
          for (const resource of item.resources) {
            const d = disciplines.find(
              (x) => x.label.toLowerCase() === resource.toLowerCase()
            );

            if (d) node.disciplines.push(this.getDisciple(d));
          }
        const children = this.convertExcelNodes(items, node);

        node.childrenIds = children.map((x) => x.id);

        nodes.push(node, ...children);
        childLevel++;
      } else {
        keepLooking = false;
      }
    }
    this.setMoveDown(nodes);

    return nodes;
  }

  private convertProjectNodes(
    items: WbsImportResult[],
    parent?: ImportTask
  ): ImportTask[] {
    const disciplines = this.metadata.categories.disciplines;
    const people = this.peopleList();
    const nodes: ImportTask[] = [];
    let childLevel = 1;
    let keepLooking = true;

    while (keepLooking) {
      const levels = [...(parent?.levels ?? []), childLevel];
      const levelText = levels.join('.');
      const item = items.find((x) => x.levelText === levelText);

      if (item) {
        const resources = item.resources
          .map((p) => structuredClone(people.find((x) => x.name === p)))
          .filter((x) => x != null);

        const node: ImportTask = {
          id: item.id,
          parentId: parent?.id,
          levelText: levelText,
          levels: levels,
          order: childLevel,
          title: item.title,
          childrenIds: [],
          resources,
          disciplines: this.getDisciples(disciplines, resources),
          canMoveLeft: parent != null,
          canMoveRight: childLevel > 1,
          canMoveUp: childLevel > 1,
          canMoveDown: true,
        };
        const children = this.convertProjectNodes(items, node);

        node.childrenIds = children.map((x) => x.id);

        nodes.push(node, ...children);
        childLevel++;
      } else {
        keepLooking = false;
      }
    }
    this.setMoveDown(nodes);

    return nodes;
  }

  private getDisciples(
    definitions: Category[],
    resources: ProjectPlanPerson[]
  ): CategoryViewModel[] {
    return resources
      .filter((r) => r.discipline)
      .map((r) => this.getDiscipleFromId(definitions, r.discipline!))
      .filter((d, i, list) => list.map((x) => x.id).indexOf(d.id) === i);
  }

  private getDiscipleFromId(
    definitions: Category[],
    id: string
  ): CategoryViewModel {
    return this.getDisciple(definitions.find((d) => d.id === id)!);
  }

  private getDisciple(cat: Category): CategoryViewModel {
    return {
      id: cat.id,
      label: cat.label,
      icon: cat.icon!,
      isCustom: false,
    };
  }

  private setMoveDown(list: ImportTask[]): void {
    const parentIds = [...new Set(list.map((x) => x.parentId))];

    for (const parentId of parentIds) {
      const children = list
        .filter((x) => x.parentId === parentId)
        .sort((a, b) => sorter(a.order, b.order));

      if (children.length < 2) continue;

      children.at(-1)!.canMoveDown = false;
    }
  }
}
