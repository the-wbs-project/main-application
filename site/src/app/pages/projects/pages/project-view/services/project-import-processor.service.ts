import { Injectable, inject } from '@angular/core';
import {
  LibraryEntryNode,
  ProjectCategoryChanges,
  ProjectNode,
} from '@wbs/core/models';
import { IdService, sorter } from '@wbs/core/services';
import { LibraryImportResults } from '@wbs/core/view-models';
import { forkJoin, Observable } from 'rxjs';
import { ProjectStore } from '../stores';
import { ProjectService } from './project.service';
import { ProjectTaskService } from './project-task.service';

@Injectable()
export class ProjectImportProcessorService {
  private readonly projectService = inject(ProjectService);
  private readonly projectStore = inject(ProjectStore);
  private readonly taskService = inject(ProjectTaskService);

  importAsync(
    taskId: string,
    dir: string,
    results: LibraryImportResults
  ): Observable<unknown> {
    const project = this.projectStore.project()!;
    const tasks = this.projectStore.tasks() ?? [];
    const fromTask = tasks.find((t) => t.id === taskId)!;
    const allSiblings = tasks
      .filter((x) => x.parentId === fromTask.parentId)
      .sort((a, b) => sorter(a.order, b.order));
    const upserts: ProjectNode[] = [];
    let startOrder =
      dir === 'right'
        ? tasks.filter((x) => x.parentId === fromTask.id).length + 1
        : fromTask.order + (dir === 'above' ? -1 : 1);

    const saves: Observable<unknown>[] = [];

    if (startOrder < 1) startOrder = 1;

    if (dir != 'right') {
      //
      //    Let's start by reordering the sibling sure to subtract by 1 for index purposes
      //
      for (let i = startOrder - 1; i < allSiblings.length; i++) {
        allSiblings[i].order++;

        upserts.push(allSiblings[i]);
      }
    }
    if (results.importDisciplines && results.disciplines) {
      const changes: ProjectCategoryChanges = {
        categories: project.disciplines,
        removedIds: [],
      };
      //
      //  Let's make sure all disciplines added to the task are now in the project.
      //
      for (const discipline of results.disciplines) {
        if (discipline.isCustom) {
          let name = discipline.label;
          let index = changes.categories.findIndex(
            (x) => x.isCustom && x.label === name
          );

          if (index === -1)
            changes.categories.push({
              id: IdService.generate(),
              label: name,
              isCustom: true,
              icon: discipline.icon!,
            });
        } else if (!changes.categories.find((x) => x.id === discipline.id)) {
          changes.categories.push(discipline);
        }
      }
      saves.push(this.projectService.changeProjectDisciplines(changes));
    }

    const run = (
      task: LibraryEntryNode,
      parentId: string | undefined,
      order: number,
      addLink: boolean
    ) => {
      const pTask: ProjectNode = {
        id: IdService.generate(),
        parentId,
        order: order,
        title: task.title,
        projectId: project.id,
        description: task.description,
        disciplineIds: task.disciplineIds,
        phaseIdAssociation: task.phaseIdAssociation,
        lastModified: new Date(),
        absFlag: null,
        libraryLink: addLink
          ? {
              owner: results.owner,
              entryId: results.version.entryId,
              version: results.version.version,
            }
          : undefined,
        libraryTaskLink: {
          owner: results.owner,
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
      run(
        node,
        dir === 'right' ? fromTask.id : fromTask.parentId,
        currentIndex,
        true
      );
      currentIndex++;
    }

    saves.push(this.taskService.saveTasks(project, upserts));

    return forkJoin(saves);
    /*tap(() => {
        const record = this.timeline.createProjectRecord({
          action: PROJECT_ACTIONS.IMPORTED_NODE_FROM_LIBRARY,
          topLevelId: project.id,
          objectId: taskId,
          data: {
            direction: dir,
            title: results.version.title,
            libraryInfo: {
              owner: results.owner,
              entryId: results.version.entryId,
              version: results.version.version,
              title: results.version.title,
            },
          },
        });
        // this.timeline.saveProjectActions([record]);
      })*/
  }
}
