import { Pipe, PipeTransform } from '@angular/core';
import { ActionMenuItem } from '@wbs/shared/models';
import { WbsNodeView } from '@wbs/shared/view-models';
import { MenuItems } from '../models';

@Pipe({ name: 'taskMenu' })
export class TaskMenuPipe implements PipeTransform {
  transform(
    tasks: WbsNodeView[] | undefined | null,
    taskId: string | undefined | null
  ): ActionMenuItem[][] {
    const nav: ActionMenuItem[] = [];
    const task = tasks?.find((x) => x.id === taskId);

    if (!task) return [];

    for (const item of MenuItems.phaseItemNavActions) {
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

    for (const item of MenuItems.phaseItemActions) {
      if (item.action === 'addSub' || task.parentId != null) actions.push(item);
    }
    return [MenuItems.phaseTreeActions, actions, nav];
  }
}
