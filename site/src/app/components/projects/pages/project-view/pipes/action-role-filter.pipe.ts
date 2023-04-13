import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { ProjectState } from '@wbs/components/projects/states';
import { ActionMenuItem } from '@wbs/core/models';

@Pipe({ name: 'actionRoleFilter' })
export class ActionRoleFilterPipe implements PipeTransform {
  constructor(private readonly store: Store) {}

  transform(actions: ActionMenuItem[]): ActionMenuItem[] {
    if (!actions || actions.length === 0) return actions;

    const results: ActionMenuItem[] = [];
    const userRoles = this.store.selectSnapshot(ProjectState.roles) ?? [];

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
