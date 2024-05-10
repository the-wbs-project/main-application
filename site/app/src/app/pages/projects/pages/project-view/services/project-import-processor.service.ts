import { Injectable, inject } from '@angular/core';
import {
  LibraryEntryNode,
  LibraryImportResults,
  ProjectNode,
} from '@wbs/core/models';
import { IdService, SignalStore, sorter } from '@wbs/core/services';
import { PROJECT_ACTIONS } from '@wbs/pages/projects/models';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SaveProject, SaveTasks } from '../actions';
import { ProjectState, TasksState } from '../states';
import { TimelineService } from './timeline.service';

@Injectable()
export class ProjectImportProcessorService {
  private readonly store = inject(SignalStore);
  private readonly timeline = inject(TimelineService);

  importAsync(
    taskId: string,
    dir: string,
    results: LibraryImportResults
  ): Observable<void> {
    const project = this.store.selectSnapshot(ProjectState.current)!;
    const tasks = this.store.selectSnapshot(TasksState.nodes)!;
    const fromTask = tasks.find((t) => t.id === taskId)!;
    const allSiblings = tasks
      .filter((x) => x.parentId === fromTask.parentId)
      .sort((a, b) => sorter(a.order, b.order));
    const upserts: ProjectNode[] = [];
    let startOrder =
      dir === 'right'
        ? tasks.filter((x) => x.parentId === fromTask.id).length + 1
        : fromTask.order + (dir === 'above' ? -1 : 1);

    if (startOrder < 1) startOrder = 1;

    console.log(startOrder);

    if (dir != 'right') {
      //
      //    Let's start by reordering the sibling sure to subtract by 1 for index purposes
      //
      for (let i = startOrder - 1; i < allSiblings.length; i++) {
        allSiblings[i].order++;

        upserts.push(allSiblings[i]);
      }
    }
    if (results.importDisciplines) {
      //
      //  Let's make sure all disciplines added to the task are now in the project.
      //
      for (const discipline of results.version.disciplines) {
        if (typeof discipline === 'string') {
          if (!project.disciplines.includes(discipline)) {
            project.disciplines.push(discipline);
          }
        } else {
          let name = discipline.label;
          let found = false;

          for (const pDiscipline of project.disciplines) {
            if (typeof pDiscipline === 'string') continue;

            if (pDiscipline.label === name) {
              found = true;
              break;
            }
          }
          if (!found) {
            project.disciplines.push(discipline);
          }
        }
      }
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
        libraryLink: addLink
          ? {
              owner: results.owner,
              entryId: results.version.entryId,
              version: results.version.version,
            }
          : undefined,
      };
      upserts.push(pTask);

      const children = results.tasks.filter((t) => t.parentId === task.id);

      for (let i = 0; i < children.length; i++) {
        run(children[i], pTask.id, i + 1, false);
      }
    };

    const first = results.tasks.find((x) => x.parentId == null)!;

    run(
      first,
      dir === 'right' ? fromTask.id : fromTask.parentId,
      startOrder,
      true
    );

    return this.store
      .dispatch([new SaveProject(project), new SaveTasks(upserts)])
      .pipe(
        tap(() => {
          const record = this.timeline.createProjectRecord({
            action: PROJECT_ACTIONS.IMPORTED_NODE_FROM_LIBRARY,
            topLevelId: project.id,
            objectId: taskId,
            data: {
              direction: dir,
              libraryInfo: {
                owner: results.owner,
                entryId: results.version.entryId,
                version: results.version.version,
              },
            },
          });
          this.timeline.saveProjectActions([record]);
        })
      );
  }
}
