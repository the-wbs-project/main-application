import { Injectable, inject } from '@angular/core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { ImportFromFileDialogComponent } from '@wbs/components/import-from-file-dialog';
import {
  ImportFromLibraryDialogComponent,
  LibraryImportResults,
} from '@wbs/components/import-from-library-dialog';
import { LibraryEntryNode, WbsNode } from '@wbs/core/models';
import { IdService, sorter } from '@wbs/core/services';
import { EntryService, EntryTaskService } from '@wbs/core/services/library';
import { EntryStore } from '@wbs/core/store';
import { LibraryTaskViewModel } from '@wbs/core/view-models';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class LibraryImportService {
  private readonly dialogService = inject(DialogService);
  private readonly entryService = inject(EntryService);
  private readonly store = inject(EntryStore);
  private readonly taskService = inject(EntryTaskService);

  importFromLibraryAsync(taskId?: string): Observable<boolean> {
    return ImportFromLibraryDialogComponent.launchAsync(
      this.dialogService,
      (results) =>
        this.saveFromLibraryAsync(taskId, results).pipe(map(() => true))
    );
  }

  importFromFileAsync(taskId?: string): Observable<boolean> {
    return ImportFromFileDialogComponent.launchAsync(
      this.dialogService,
      this.store.versionDisciplines(),
      (tasks) => this.saveFromFileAsync(taskId, tasks).pipe(map(() => true))
    );
  }

  private saveFromLibraryAsync(
    taskId: string | undefined,
    results: LibraryImportResults
  ): Observable<unknown> {
    const version = this.store.version()!;
    const tasks = this.store.tasks()!;
    const upserts: LibraryEntryNode[] = [];
    let startOrder = this.getOrderNumber(tasks, taskId);
    const disciplines = structuredClone(version.disciplines);
    let disciplinesChanged = false;

    const run = (
      task: LibraryTaskViewModel,
      parentId: string | undefined,
      order: number,
      addLink: boolean
    ) => {
      if (task.disciplines) {
        //
        //
        //  Make sure all disciplines are in the project
        //
        for (const discipline of task.disciplines) {
          if (!disciplines.find((x) => x.id === discipline.id)) {
            disciplines.push({
              id: discipline.id,
              label: discipline.label,
              isCustom: discipline.isCustom,
              icon: discipline.icon,
            });
            disciplinesChanged = true;
          }
        }
      }

      const newTask: LibraryEntryNode = {
        id: IdService.generate(),
        parentId,
        order: order,
        title: task.title,
        description: task.description,
        disciplineIds: task.disciplines.map((x) => x.id),
        phaseIdAssociation: task.phaseIdAssociation,
        lastModified: new Date(),
        libraryLink: addLink
          ? {
              owner: results.version.ownerId,
              entryId: results.version.entryId,
              version: results.version.version,
            }
          : undefined,
      };
      upserts.push(newTask);

      const children = results.tasks.filter((t) => t.parentId === task.id);

      for (let i = 0; i < children.length; i++) {
        run(children[i], newTask.id, i + 1, false);
      }
    };

    let currentIndex = startOrder;

    const rootNodes = results.tasks
      .filter((x) => x.parentId == null)
      .sort((a, b) => sorter(a.order, b.order));

    for (const node of rootNodes) {
      run(node, taskId, currentIndex, true);
      currentIndex++;
    }

    const saves: Observable<unknown>[] = [];

    if (disciplinesChanged) {
      saves.push(this.entryService.disciplinesChangedAsync(disciplines));
    }

    saves.push(this.taskService.importTasks(upserts));

    return forkJoin(saves);
  }

  private saveFromFileAsync(
    taskId: string | undefined,
    tasks: WbsNode[]
  ): Observable<unknown> {
    const upserts: LibraryEntryNode[] = [];

    for (const task of tasks) {
      if (task.parentId == undefined) {
        task.parentId = taskId;
        task.order = this.getOrderNumber(tasks, task.parentId);
      }

      upserts.push(task);
    }
    return this.taskService.importTasks(upserts);
  }

  private getOrderNumber(
    tasks: WbsNode[],
    parentId: string | undefined
  ): number {
    const siblings = tasks.filter((x) => x.parentId === parentId);

    return siblings.length === 0
      ? 1
      : Math.max(...siblings.map((x) => x.order)) + 1;
  }
}
