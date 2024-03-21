import { Injectable } from '@angular/core';
import { LibraryEntryVersion } from '@wbs/core/models';
import { WbsNodeView } from '@wbs/core/view-models';
import { ContextMenuItem } from '@wbs/main/models';
import { LIBRARY_TREE_MENU_ITEMS } from '../models';

declare type Seperator = { separator: true };

@Injectable()
export class EntryTreeMenuService {
  buildMenu(
    entryType: string,
    version: LibraryEntryVersion,
    task: WbsNodeView | undefined,
    claims: string[]
  ): (ContextMenuItem | Seperator)[] {
    if (task === undefined) return [];

    const phaseActions = this.filterList(
      this.preFilterActions(
        LIBRARY_TREE_MENU_ITEMS.taskActions,
        entryType,
        task
      ),
      task,
      claims,
      version.status
    );
    const movers: ContextMenuItem[] = [];

    if (this.canHaveNavActions(entryType, task)) {
      const navActions = this.filterList(
        LIBRARY_TREE_MENU_ITEMS.reorderTaskActions,
        task,
        claims,
        version.status
      );
      for (const item of navActions) {
        if (item.action === 'moveLeft' && task.canMoveLeft) movers.push(item);
        else if (item.action === 'moveRight' && task.canMoveRight)
          movers.push(item);
        else if (item.action === 'moveUp' && task.canMoveUp) movers.push(item);
        else if (item.action === 'moveDown' && task.canMoveDown)
          movers.push(item);
      }
    }

    return movers.length === 0
      ? phaseActions
      : [...phaseActions, { separator: true }, ...movers];
  }

  private filterList(
    actions: ContextMenuItem[],
    task: WbsNodeView | undefined,
    claims: string[],
    status: string
  ): ContextMenuItem[] {
    if (!actions || actions.length === 0) return actions;

    const results: ContextMenuItem[] = [];

    for (const action of actions) {
      if (this.filterItem(action, task, claims, status)) {
        results.push(action);
      }
    }

    return results;
  }

  private filterItem(
    link: ContextMenuItem,
    task: WbsNodeView | undefined,
    claims: string[],
    status: string
  ): boolean {
    if (!link.filters) return true;
    //
    //  Perform cat check
    //
    if (
      task &&
      link.filters.excludeFromCat &&
      (task.id === task.phaseId || task.id === task.disciplines[0])
    )
      return false;

    if (link.filters.claim && !claims.includes(link.filters.claim))
      return false;

    if (link.filters.stati) {
      const statusResult = link.filters.stati.some((s) => s === status);

      if (!statusResult) return false;
    }

    return true;
  }

  private preFilterActions(
    items: ContextMenuItem[],
    entryType: string,
    task: WbsNodeView
  ): ContextMenuItem[] {
    const filter = entryType !== 'project' && task.parentId == undefined;

    if (!filter) return items;

    return items.filter(
      (x) => x.action !== 'cloneTask' && x.action !== 'deleteTask'
    );
  }

  private canHaveNavActions(entryType: string, task: WbsNodeView): boolean {
    return entryType === 'project' || task.parentId != undefined;
  }
}
