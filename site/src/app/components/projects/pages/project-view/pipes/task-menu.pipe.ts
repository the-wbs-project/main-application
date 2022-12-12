import { Pipe, PipeTransform } from '@angular/core';
import { ActionMenuItem } from '@wbs/core/models';
import { WbsNodeView } from '@wbs/core/view-models';
import { PROJECT_MENU_ITEMS } from '../models';

@Pipe({ name: 'taskMenu' })
export class TaskMenuPipe implements PipeTransform {
  transform(
    tasks: WbsNodeView[] | undefined | null,
    taskId: string | undefined | null
  ): ActionMenuItem[][] {
    const nav: ActionMenuItem[] = [];
    const task = tasks?.find((x) => x.id === taskId);

    if (!task) return [PROJECT_MENU_ITEMS.phaseTreeActions];

    for (const item of PROJECT_MENU_ITEMS.phaseItemNavActions) {
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

    const actions: ActionMenuItem[] = [];

    for (const item of PROJECT_MENU_ITEMS.phaseItemActions) {
      if (item.action === 'addSub' || task.parentId != null) actions.push(item);
    }
    return [PROJECT_MENU_ITEMS.phaseTreeActions, actions, nav];
  }
}
