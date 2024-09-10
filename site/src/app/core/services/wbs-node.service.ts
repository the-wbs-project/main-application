import { Injectable } from '@angular/core';
import {
  LibraryEntryNode,
  WbsNode,
  ProjectCategory,
  RebuildResults,
} from '@wbs/core/models';
import { TaskViewModel } from '@wbs/core/view-models';
import { sorter } from './sorter.service';

declare type BasicTask = {
  id: string;
  parentId?: string;
  order: number;
  levels: number[];
  levelText: string;
};

@Injectable({ providedIn: 'root' })
export class WbsNodeService {
  static sort = (
    a: WbsNode | TaskViewModel | BasicTask,
    b: WbsNode | TaskViewModel | BasicTask
  ) => ((a.order ?? 0) < (b.order ?? 0) ? -1 : 1);

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

  static getSortedChildrenForPhase<
    T extends { parentId?: string; order: number }
  >(parentId: string | undefined, list: T[]): T[] {
    return list
      .filter((x) => x.parentId === parentId)
      .sort((a, b) => sorter(a.order, b.order));
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

  moveTaskDown<T extends BasicTask>(tasks: T[], taskId: string): T[] {
    const task = tasks.find((x) => x.id === taskId)!;
    const task2 = tasks.find(
      (x) => x.parentId === task?.parentId && x.order === task.order + 1
    );
    if (!task || !task2) return [];

    console.log(task.levelText, task.order);
    console.log(task2.levelText, task2.order);

    task.order++;
    task2.order--;

    console.log(task.levelText, task.order);
    console.log(task2.levelText, task2.order);

    return [task, task2];
  }

  moveTaskUp<T extends BasicTask>(tasks: T[], taskId: string): T[] {
    const task = tasks.find((x) => x.id === taskId)!;
    const task2 = tasks.find(
      (x) => x.parentId === task?.parentId && x.order === task.order - 1
    );
    if (!task || !task2) return [];

    task.order--;
    task2.order++;

    return [task, task2];
  }

  moveTaskLeft<T extends BasicTask>(tasks: T[], taskId: string): T[] {
    const task = tasks.find((x) => x.id === taskId)!;
    const parent = tasks.find((x) => x.id === task?.parentId);

    if (!task || !parent) return [];

    const toSave: T[] = [];
    //
    //  Renumber the old siblings
    //
    for (const sibling of tasks.filter((x) => x.parentId === parent.id)) {
      if (sibling.order <= task.order || sibling.id === task.id) continue;

      sibling.order--;
      toSave.push(sibling);
    }

    task.parentId = parent.parentId;
    task.order = parent.order + 1;
    //
    //  Renumber the new siblings
    //
    for (const sibling of tasks.filter((x) => x.parentId === parent.parentId)) {
      if (sibling.order <= parent.order || sibling.id === task.id) continue;

      sibling.order++;
      toSave.push(sibling);
    }

    return [task, ...toSave];
  }

  moveTaskRight<T extends BasicTask>(tasks: T[], taskId: string): T[] {
    const task = tasks.find((x) => x.id === taskId)!;

    if (!task) return [];

    let newParent: T | undefined;
    const oldSiblings = tasks.filter((x) => x.parentId === task.parentId);
    const toSave: T[] = [];
    //
    //  Find all current siblings which are lower in the order than task and bump them up.
    //
    for (const sibling of oldSiblings) {
      if (sibling.order === task.order - 1) {
        newParent = sibling;
        continue;
      }
      if (sibling.order <= task.order) continue;

      sibling.order--;
      toSave.push(sibling);
    }
    if (!newParent) return [];

    const newSiblings = tasks.filter((x) => x.parentId === newParent?.id);

    task.parentId = newParent.id;
    task.order =
      (newSiblings.length === 0
        ? 0
        : Math.max(...newSiblings.map((x) => x.order))) + 1;

    return [task, ...toSave];
  }

  rebuildLevels<T extends BasicTask>(list: T[]): T[] {
    const results: T[] = [];

    const rebuild = (
      parentId: string | undefined,
      parentLevel: number[]
    ): void => {
      const children = this.getSortedVmChildren(parentId, list);

      for (let i = 0; i < children.length; i++) {
        const child = children[i];

        if (child.order !== i + 1) {
          child.order = i + 1;
        }
        const level = [...parentLevel, child.order];
        const levelText = level.join('.');

        if (child.levelText !== levelText) {
          child.levels = level;
          child.levelText = levelText;
        }
        if (child.parentId !== parentId) {
          child.parentId = parentId;
        }
        results.push(child);

        rebuild(child.id, level);
      }
    };

    rebuild(undefined, []);

    return results;
  }

  private getSortedVmChildren<T extends BasicTask>(
    parentId: string | undefined,
    list: T[]
  ): T[] {
    return list
      .filter((x) => x.parentId === parentId)
      .sort(WbsNodeService.sort);
  }
}
