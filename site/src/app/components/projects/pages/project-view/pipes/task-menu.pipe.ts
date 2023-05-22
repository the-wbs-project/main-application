import { Pipe, PipeTransform } from '@angular/core';
import { ActionMenuItem } from '@wbs/core/models';
import { WbsNodeView } from '@wbs/core/view-models';
import { PROJECT_MENU_ITEMS } from '../models';
import { Store } from '@ngxs/store';
import { ProjectState } from '../states';

@Pipe({ name: 'taskMenu' })
export class TaskMenuPipe implements PipeTransform {
  constructor(private readonly store: Store) {}

  transform(
    tasks: WbsNodeView[] | undefined | null,
    taskId: string | undefined | null
  ): ActionMenuItem[][] {
    const task = tasks?.find((x) => x.id === taskId);
    const userRoles = this.store.selectSnapshot(ProjectState.roles) ?? [];

    const treeActions = this.filter(
      userRoles,
      PROJECT_MENU_ITEMS.phaseTreeActions
    );
    const navActions = this.filter(
      userRoles,
      PROJECT_MENU_ITEMS.phaseItemNavActions
    );
    const phaseActions = this.filter(
      userRoles,
      PROJECT_MENU_ITEMS.phaseItemActions
    );
    const results = [treeActions];

    if (!task) return results;

    const nav: ActionMenuItem[] = [];
    const actions: ActionMenuItem[] = [];

    for (const item of phaseActions) {
      if (item.action === 'addSub' || task.parentId != null) actions.push(item);
    }

    for (const item of navActions) {
      if (item.action === 'moveLeft') {
        if (task.canMoveLeft) nav.push(item);
      } else if (item.action === 'moveRight') {
        if (task.canMoveRight) nav.push(item);
      } else if (item.action === 'moveUp') {
        if (task.canMoveUp) nav.push(item);
      } else if (item.action === 'moveDown') {
        if (task.canMoveDown) nav.push(item);
      }
    }

    if (actions.length > 0) results.push(actions);
    if (nav.length > 0) results.push(nav);

    return results;
  }

  private filter(
    userRoles: string[],
    actions: ActionMenuItem[]
  ): ActionMenuItem[] {
    if (!actions || actions.length === 0) return actions;

    const results: ActionMenuItem[] = [];

    for (const action of actions) {
      const roles = action.roles ?? [];

      if (roles.length === 0) {
        results.push(action);
        continue;
      }

      for (const role of roles) {
        if (userRoles.indexOf(role) > -1) {
          results.push(action);
          continue;
        }
      }
    }

    return results;
  }
}
