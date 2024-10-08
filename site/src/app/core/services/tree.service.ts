import { Injectable, WritableSignal, signal } from '@angular/core';
import { TreeListComponent } from '@progress/kendo-angular-treelist';
import { SaveState } from '@wbs/core/models';
import { Observable } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Injectable()
export class TreeService {
  private readonly treeMenuHeight = 48;
  private readonly treeColumnHeight = 36;
  private readonly saveStates: Map<string, WritableSignal<SaveState>> =
    new Map();
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

  expandAll<T, K extends keyof T>(tasks: T[], key: K): void {
    this.expandedKeys = tasks.map((task) => task[key] as string);
  }

  collapseAll<T, K extends keyof T>(
    treeList: TreeListComponent,
    tasks: T[],
    key: K
  ): void {
    for (const task of tasks) {
      if (this.expandedKeys.includes(task[key] as string)) {
        treeList.collapse(task);
      }
    }
  }

  disciplineWidth(items: { disciplines: any[] }[] | undefined): number {
    const max = Math.max(
      ...(items ?? []).map((x) => (x.disciplines ?? []).length)
    );

    const width = max * 25;

    return width <= 125 ? 125 : width >= 200 ? 200 : width;
  }

  levelsWidth(items: { levels: number[] }[] | undefined): number {
    const max = Math.max(...(items ?? []).map((x) => (x.levels ?? []).length));

    return max < 6 ? 80 : max < 8 ? 90 : 120;
  }

  editTitle(grid: TreeListComponent, dataItem: any, column: number): void {
    grid.editCell(dataItem, column);
  }

  getSaveState(taskId: string): WritableSignal<SaveState> | undefined {
    if (!this.saveStates.has(taskId)) {
      this.saveStates.set(taskId, signal('ready'));
    }
    return this.saveStates.get(taskId);
  }

  setSaveState(taskId: string, state: SaveState): void {
    this.saveStates.get(taskId)?.set(state);
  }

  updateState(tasks: { id: string }[]): void {
    for (const task of tasks ?? []) {
      if (!this.saveStates.has(task.id)) {
        this.saveStates.set(task.id, signal('ready'));
      }
    }
  }

  callSave<T>(
    taskId: string,
    obs: Observable<T>,
    delayMs = 5000
  ): Observable<T> {
    this.setSaveState(taskId, 'saving');

    return obs.pipe(
      tap((x) => this.setSaveState(taskId, x === false ? 'ready' : 'saved')),
      delay(delayMs),
      tap(() => this.setSaveState(taskId, 'ready'))
    );
  }

  pageSize(containerHeight: number, offset: number, rowHeight: number): number {
    const height =
      containerHeight - offset - this.treeMenuHeight - this.treeColumnHeight;
    const rows = Math.floor(height / rowHeight);

    return Math.max(20, rows * 2);
  }
}
