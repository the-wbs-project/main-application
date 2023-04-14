import { Pipe, PipeTransform } from '@angular/core';
import { ActionMenuItem, ROLES } from '@wbs/core/models';
import { WbsNodeView } from '@wbs/core/view-models';
import { TASK_MENU_ITEMS } from '../models';
import { Store } from '@ngxs/store';
import { ProjectState } from '@wbs/components/projects/states';

@Pipe({ name: 'taskDetailsActions' })
export class TaskDetailsActionsPipe implements PipeTransform {
  constructor(private readonly store: Store) {}

  transform(task: WbsNodeView | undefined | null): ActionMenuItem[] {
    if (!task) return [];

    const userRoles = this.store.selectSnapshot(ProjectState.roles) ?? [];
    const isPm = userRoles.indexOf(ROLES.PM) > -1;

    if (!isPm) return [];

    const nav: ActionMenuItem[] = [TASK_MENU_ITEMS.actions['addSubTask']];

    if (task.parentId) {
      nav.push(TASK_MENU_ITEMS.actions['clone']);
      nav.push(TASK_MENU_ITEMS.actions['delete']);
    }

    return nav;
  }
}
