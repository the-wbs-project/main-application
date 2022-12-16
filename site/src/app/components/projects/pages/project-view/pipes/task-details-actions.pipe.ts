import { Pipe, PipeTransform } from '@angular/core';
import { ActionMenuItem } from '@wbs/core/models';
import { WbsNodeView } from '@wbs/core/view-models';
import { TASK_MENU_ITEMS } from '../models';

@Pipe({ name: 'taskDetailsActions' })
export class TaskDetailsActionsPipe implements PipeTransform {
  transform(task: WbsNodeView | undefined | null): ActionMenuItem[] {
    if (!task) return [];

    const nav: ActionMenuItem[] = [TASK_MENU_ITEMS.actions['addSubTask']];

    if (task.parentId) {
      nav.push(TASK_MENU_ITEMS.actions['clone']);
      nav.push(TASK_MENU_ITEMS.actions['delete']);
    }

    return nav;
  }
}
