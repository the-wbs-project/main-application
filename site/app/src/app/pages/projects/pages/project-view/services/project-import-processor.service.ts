import { Injectable, inject } from '@angular/core';
import {
  LibraryEntryNode,
  LibraryImportResults,
  ProjectNode,
} from '@wbs/core/models';
import { IdService, SignalStore, sorter } from '@wbs/core/services';
import { ProjectState, TasksState } from '../states';

@Injectable()
export class ProjectImportProcessorService {
  private readonly store = inject(SignalStore);

  importAsync(
    taskId: string,
    dir: 'up' | 'down' | 'right',
    results: LibraryImportResults
  ) {
    const project = this.store.selectSnapshot(ProjectState.current)!;
    const tasks = this.store.selectSnapshot(TasksState.nodes)!;
    const fromTask = tasks.find((t) => t.id === taskId)!;
    const allParentsChildren = tasks
      .filter((x) => x.parentId === fromTask.parentId)
      .sort((a, b) => sorter(a.order, b.order));
    const upserts: ProjectNode[] = [];

    if (dir != 'right') {
      //
      //    Let's start by reordering the sibling sure to subtract by 1 for index purposes
      //
      let reorderStart = fromTask.order + (dir === 'up' ? -1 : 1) - 1;

      if (reorderStart < 0) reorderStart = 0;

      for (let i = reorderStart; i < allParentsChildren.length; i++) {
        allParentsChildren[i].order++;

        upserts.push(allParentsChildren[i]);
      }
    }

    const run = (task: LibraryEntryNode, parentId: string, order: number) => {
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
      };
      upserts.push(pTask);

      const children = results.tasks.filter((t) => t.parentId === task.id);

      for (let i = 0; i < children.length; i++) {
        run(children[i], pTask.id, i + 1);
      }
    };
  }
}
