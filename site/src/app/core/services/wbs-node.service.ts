import { Injectable } from '@angular/core';
import { LibraryEntryNode, WbsNode, ProjectCategory } from '@wbs/core/models';
import { TaskViewModel } from '@wbs/core/view-models';

@Injectable({ providedIn: 'root' })
export class WbsNodeService {
  static sort = (a: WbsNode | TaskViewModel, b: WbsNode | TaskViewModel) =>
    (a.order ?? 0) < (b.order ?? 0) ? -1 : 1;

  static getSubTasksForTree(
    tasks: TaskViewModel[],
    taskId: string
  ): TaskViewModel[] {
    const childrenIds = tasks.find((x) => x.id === taskId)?.childrenIds || [];
    const children = structuredClone(
      tasks.filter((x) => childrenIds.includes(x.id))
    );

    for (const root of children.filter((x) => x.parentId === taskId)) {
      root.treeParentId = undefined;
    }

    return children;
  }

  static getSortedChildrenForPhase(
    parentId: string | undefined,
    list: WbsNode[] | undefined
  ): WbsNode[] {
    return (list ?? [])
      .filter((x) => x.parentId === parentId)
      .sort(WbsNodeService.sort);
  }

  static getChildrenIds(tasks: LibraryEntryNode[], taskId: string): string[] {
    const children: string[] = [];

    for (const task of tasks.filter((x) => x.parentId === taskId)) {
      children.push(task.id);
      children.push(...WbsNodeService.getChildrenIds(tasks, task.id));
    }
    return children;
  }

  static getSiblings(tasks: WbsNode[], taskId: string): WbsNode[] {
    const task = tasks.find((x) => x.id === taskId);
    return tasks
      .filter((x) => x.parentId === task?.parentId)
      .sort(WbsNodeService.sort);
  }

  getPhases(tasks: WbsNode[]): ProjectCategory[] {
    const phases: ProjectCategory[] = [];
    const taskPhases = tasks
      .filter((x) => x.parentId == undefined)
      .sort((a, b) => a.order - b.order);

    for (const phase of taskPhases) {
      phases.push({
        id: phase.id,
        isCustom: true,
        label: phase.title,
        description: phase.description,
      });
    }
    return phases;
  }
}
