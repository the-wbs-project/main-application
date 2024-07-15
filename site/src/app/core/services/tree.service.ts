import { Injectable } from '@angular/core';
import { TreeListComponent } from '@progress/kendo-angular-treelist';
import { TaskViewModel } from '@wbs/core/view-models';

@Injectable()
export class TreeService {
  expandedKeys: string[] = [];

  verifyExpanded(taskId: string | undefined): void {
    if (taskId && !this.expandedKeys.includes(taskId)) {
      this.expand(taskId);
    }
  }

  expand(taskId: string): void {
    const keys = structuredClone(this.expandedKeys);

    if (!keys.includes(taskId)) {
      keys.push(taskId);
    }
    this.expandedKeys = keys;
  }

  collapse(taskId: string): void {
    const keys = structuredClone(this.expandedKeys);
    const index = keys.indexOf(taskId);

    if (index > -1) {
      keys.splice(index, 1);
    }
    this.expandedKeys = keys;
  }

  expandAll(treeList: TreeListComponent, tasks: TaskViewModel[]): void {
    this.expandedKeys = tasks.map((task) => task.treeId);
  }

  collapseAll(treeList: TreeListComponent, tasks: TaskViewModel[]): void {
    for (const task of tasks) {
      if (this.expandedKeys.includes(task.treeId)) {
        treeList.collapse(task);
      }
    }
  }
}
