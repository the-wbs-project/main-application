import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { ActionMenuItem, PROJECT_STATI_TYPE } from '@wbs/core/models';
import { WbsNodeView } from '@wbs/core/view-models';
import { ProjectPermissionsService } from '@wbs/main/services';
import { RolesState } from '@wbs/main/states';
import { PROJECT_MENU_ITEMS } from '../models';
import { ProjectState } from '../states';

@Pipe({ name: 'taskMenu', standalone: true })
export class TaskMenuPipe implements PipeTransform {
  constructor(
    private readonly permissionService: ProjectPermissionsService,
    private readonly store: Store
  ) {}

  transform(
    tasks: WbsNodeView[] | undefined | null,
    taskId: string | undefined | null
  ): ActionMenuItem[][] {
    const task = tasks?.find((x) => x.id === taskId);
    const permissions = this.store.selectSnapshot(ProjectState.permissions);
    const status = this.store.selectSnapshot(ProjectState.current)!.status;

    const treeActions = this.filterList(
      PROJECT_MENU_ITEMS.phaseTreeActions,
      task,
      permissions,
      status
    );
    const results = [treeActions];

    const navActions = this.filterList(
      PROJECT_MENU_ITEMS.phaseItemNavActions,
      task,
      permissions,
      status
    );
    const phaseActions = this.filterList(
      PROJECT_MENU_ITEMS.phaseItemActions,
      task,
      permissions,
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

    return results;
  }

  private filterList(
    actions: ActionMenuItem[],
    task: WbsNodeView | undefined,
    permissions: Map<string, boolean>,
    status: PROJECT_STATI_TYPE
  ): ActionMenuItem[] {
    if (!actions || actions.length === 0) return actions;

    const results: ActionMenuItem[] = [];

    for (const action of actions) {
      if (this.filterItem(action, task, permissions, status)) {
        results.push(action);
      }
    }

    return results;
  }

  private filterItem(
    link: ActionMenuItem,
    task: WbsNodeView | undefined,
    permissions: Map<string, boolean>,
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

    if (link.permissions) {
      const result = this.permissionService.check(
        permissions,
        link.permissions
      );

      if (!result) return false;
    }
    if (link.filters.stati) {
      const statusResult = link.filters.stati.some((s) => s === status);

      if (!statusResult) return false;
    }

    return true;
  }

  private convertRoles(roles: string[]): string[] {
    const ids = this.store.selectSnapshot(RolesState.ids);
    const results: string[] = [];

    for (const role of roles) {
      if (role === 'admin') results.push(ids.admin);
      else if (role === 'approver') results.push(ids.approver);
      else if (role === 'pm') results.push(ids.pm);
      else if (role === 'sme') results.push(ids.sme);
    }

    return results;
  }
}
