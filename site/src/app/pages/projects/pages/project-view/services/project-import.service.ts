import { Injectable, inject } from '@angular/core';
import { DialogService } from '@progress/kendo-angular-dialog';
import {
  ImportFromLibraryDialogComponent,
  LibraryImportResults,
} from '@wbs/components/import-from-library-dialog';
import { ImportFromFileDialogComponent } from '@wbs/components/import-from-file-dialog';
import { ProjectNode, WbsNode } from '@wbs/core/models';
import { IdService, sorter } from '@wbs/core/services';
import { LibraryTaskViewModel } from '@wbs/core/view-models';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectStore } from '../stores';
import { ProjectService } from './project.service';
import { ProjectTaskService } from './project-task.service';

@Injectable()
export class ProjectImportService {
  private readonly dialogService = inject(DialogService);
  private readonly projectService = inject(ProjectService);
  private readonly store = inject(ProjectStore);
  private readonly taskService = inject(ProjectTaskService);

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
      this.store.projectDisciplines(),
      (tasks) => this.saveFromFileAsync(taskId, tasks).pipe(map(() => true))
    );
  }

  private saveFromFileAsync(
    taskId: string | undefined,
    tasks: WbsNode[]
  ): Observable<unknown> {
    const upserts: ProjectNode[] = [];
    const project = this.store.project()!;
    const existingTasks = this.store.tasks() ?? [];

    for (const task of tasks) {
      if (task.parentId == undefined) {
        task.parentId = taskId;
        task.order = this.getOrderNumber(existingTasks, task.parentId);
      }

      upserts.push({
        ...task,
        projectId: project.id,
        absFlag: null,
      });
    }
    return this.taskService.importTasks(upserts);
  }

  private saveFromLibraryAsync(
    taskId: string | undefined,
    results: LibraryImportResults
  ): Observable<unknown> {
    const project = this.store.project()!;
    const existingTasks = this.store.tasks() ?? [];
    const upserts: ProjectNode[] = [];
    let startOrder = this.getOrderNumber(existingTasks, taskId);

    const disciplines = structuredClone(project.disciplines);
    let disciplinesChanged = false;

    if (startOrder < 1) startOrder = 1;

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

      const pTask: ProjectNode = {
        id: IdService.generate(),
        parentId,
        order: order,
        title: task.title,
        projectId: project.id,
        description: task.description,
        disciplineIds: task.disciplines.map((x) => x.id),
        phaseIdAssociation: task.phaseIdAssociation,
        lastModified: new Date(),
        absFlag: null,
        libraryLink: addLink
          ? {
              owner: results.version.ownerId,
              entryId: results.version.entryId,
              version: results.version.version,
            }
          : undefined,
        libraryTaskLink: {
          owner: results.version.ownerId,
          entryId: results.version.entryId,
          version: results.version.version,
          taskId: task.id,
        },
      };
      upserts.push(pTask);

      const children = results.tasks
        .filter((t) => t.parentId === task.id)
        .sort((a, b) => sorter(a.order, b.order));

      for (let i = 0; i < children.length; i++) {
        run(children[i], pTask.id, i + 1, false);
      }
    };

    const rootNodes = results.tasks
      .filter((x) => x.parentId == null)
      .sort((a, b) => sorter(a.order, b.order));

    let currentIndex = startOrder;

    for (const node of rootNodes) {
      run(node, taskId, currentIndex, true);
      currentIndex++;
    }

    const saves: Observable<unknown>[] = [];

    if (disciplinesChanged) {
      saves.push(
        this.projectService.changeProjectDisciplines({
          categories: disciplines,
          removedIds: [],
        })
      );
    }

    saves.push(this.taskService.importTasks(upserts));

    return forkJoin(saves);
  }

  private getOrderNumber(
    tasks: WbsNode[],
    parentId: string | undefined
  ): number {
    const siblings = tasks.filter((x) => x.parentId == parentId); //dont use 3 equal signs

    return siblings.length === 0
      ? 1
      : Math.max(...siblings.map((x) => x.order)) + 1;
  }
}
