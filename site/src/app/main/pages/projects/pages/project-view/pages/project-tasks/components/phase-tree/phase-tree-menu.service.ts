import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { PROJECT_STATI_TYPE } from '@wbs/core/models';
import { WbsNodeView } from '@wbs/core/view-models';
import { ContextMenuItem } from '@wbs/main/models';
import { PROJECT_TREE_MENU_ITEMS } from '../../../../models';
import { ProjectState } from '../../../../states';

declare type Seperator = { separator: true };

@Injectable()
export class PhaseTreeMenuService {
  constructor(private readonly store: Store) {}

  buildMenu(
    tasks: WbsNodeView[],
    claims: string[],
    selectedTaskId: string | undefined
  ): (ContextMenuItem | Seperator)[] {
    if (selectedTaskId === undefined) return [];

    const task = tasks?.find((x) => x.id === selectedTaskId)!;
    const status = this.store.selectSnapshot(ProjectState.current)!.status;
    const navActions = this.filterList(
      PROJECT_TREE_MENU_ITEMS.reorderTaskActions,
      task,
      claims,
      status
    );
    const phaseActions = this.filterList(
      PROJECT_TREE_MENU_ITEMS.taskActions,
      task,
      claims,
      status
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

  private filterList(
    actions: ContextMenuItem[],
    task: WbsNodeView | undefined,
    claims: string[],
    status: PROJECT_STATI_TYPE
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
    status: PROJECT_STATI_TYPE
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
}
