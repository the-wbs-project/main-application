import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { ActionMenuItem, PROJECT_STATI_TYPE } from '@wbs/core/models';
import { WbsNodeView } from '@wbs/core/view-models';
import { PROJECT_MENU_ITEMS } from '../models';
import { ProjectState } from '../states';

@Pipe({ name: 'taskMenu', standalone: true })
export class TaskMenuPipe implements PipeTransform {
  constructor(private readonly store: Store) {}

  transform(
    [tasks, claims]: [WbsNodeView[] | undefined | null, string[]],
    taskId: string | undefined | null
  ): ActionMenuItem[][] {
    console.log(taskId);

    const task = tasks?.find((x) => x.id === taskId);
    const status = this.store.selectSnapshot(ProjectState.current)!.status;
    const results: ActionMenuItem[][] = [];

    const navActions = this.filterList(
      PROJECT_MENU_ITEMS.reorderTaskActions,
      task,
      claims,
      status
    );
    const phaseActions = this.filterList(
      PROJECT_MENU_ITEMS.taskActions,
      task,
      claims,
      status
    );
    if (!task) return results;

    const nav: ActionMenuItem[] = [];

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

    if (phaseActions.length > 0) results.push(phaseActions);
    if (nav.length > 0) results.push(nav);

    console.log(results);
    return results;
  }

  private filterList(
    actions: ActionMenuItem[],
    task: WbsNodeView | undefined,
    claims: string[],
    status: PROJECT_STATI_TYPE
  ): ActionMenuItem[] {
    if (!actions || actions.length === 0) return actions;

    const results: ActionMenuItem[] = [];

    for (const action of actions) {
      if (this.filterItem(action, task, claims, status)) {
        results.push(action);
      }
    }

    return results;
  }

  private filterItem(
    link: ActionMenuItem,
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

    if (link.claim && !claims.includes(link.claim)) return false;

    if (link.filters.stati) {
      const statusResult = link.filters.stati.some((s) => s === status);

      if (!statusResult) return false;
    }

    return true;
  }
}
