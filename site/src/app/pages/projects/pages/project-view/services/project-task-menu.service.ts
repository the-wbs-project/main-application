import { inject, Injectable } from '@angular/core';
import { ContextMenuItem } from '@wbs/core/models';
import { MenuService } from '@wbs/core/services';
import { ProjectTaskViewModel } from '@wbs/core/view-models';
import { PROJECT_TREE_MENU_ITEMS } from '../models';
import { ProjectStore } from '../stores';

declare type Seperator = { separator: true };

@Injectable()
export class ProjectTaskMenuService {
  private menuService = inject(MenuService);
  private readonly store = inject(ProjectStore);

  buildMenu(
    task: ProjectTaskViewModel | undefined
  ): (ContextMenuItem | Seperator)[] {
    if (!task) return [];
    const project = this.store.project();
    const claims = this.store.claims();

    if (!project) return [];

    const status = project.status;
    const navActions = this.menuService.filterList(
      structuredClone(PROJECT_TREE_MENU_ITEMS.reorderTaskActions),
      claims,
      status,
      task
    );
    const phaseActions = this.menuService.filterList(
      structuredClone(PROJECT_TREE_MENU_ITEMS.taskActions),
      claims,
      status,
      task
    );

    const movers: ContextMenuItem[] = [];

    for (const item of navActions) {
      if (item.action === 'moveLeft') {
        if (task.canMoveLeft) movers.push(item);
      } else if (item.action === 'moveRight') {
        if (task.canMoveRight) movers.push(item);
      } else if (item.action === 'moveUp') {
        if (task.canMoveUp) movers.push(item);
      } else if (item.action === 'moveDown') {
        if (task.canMoveDown) movers.push(item);
      }
    }
    return movers.length === 0
      ? phaseActions
      : [...phaseActions, { separator: true }, ...movers];
  }
}
