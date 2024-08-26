import { Injectable, inject } from '@angular/core';
import { ActionContextMenuItem, ContextMenuItem } from '@wbs/core/models';
import { MenuService } from '@wbs/core/services';
import { EntryStore } from '@wbs/core/store';
import { TaskViewModel } from '@wbs/core/view-models';
import { LIBRARY_TREE_MENU_ITEMS } from '../models';

declare type Seperator = { separator: true };

@Injectable()
export class LibraryTreeMenuService {
  private readonly menuService = inject(MenuService);
  private readonly store = inject(EntryStore);

  buildMenu(task: TaskViewModel | undefined): (ContextMenuItem | Seperator)[] {
    if (task === undefined) return [];

    const version = this.store.version()!;
    const claims = this.store.claims();

    const phaseActions = this.menuService.filterList(
      this.preFilterActions(
        LIBRARY_TREE_MENU_ITEMS.taskActions,
        version.type,
        task
      ),
      claims,
      version.status,
      version
    );
    const movers: ActionContextMenuItem[] = [];

    if (this.canHaveNavActions(version.type, task)) {
      const navActions = this.menuService.filterList(
        LIBRARY_TREE_MENU_ITEMS.reorderTaskActions,
        claims,
        version.status,
        version
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

  private preFilterActions(
    items: ActionContextMenuItem[],
    entryType: string,
    task: TaskViewModel
  ): ActionContextMenuItem[] {
    const filter = entryType !== 'project' && task.parentId == undefined;

    if (!filter) return items;

    return items.filter(
      (x) => x.action !== 'cloneTask' && x.action !== 'deleteTask'
    );
  }

  private canHaveNavActions(entryType: string, task: TaskViewModel): boolean {
    return entryType === 'project' || task.parentId != undefined;
  }
}
