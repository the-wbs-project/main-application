import { Injectable } from '@angular/core';
import { ROLES_TYPE, UserLite } from '@wbs/core/models';
import { RoleUsersViewModel } from './view-models/role-users.view-model';

@Injectable()
export class RoleUsersService {
  get(
    roleId: ROLES_TYPE,
    userIds: string[] | undefined,
    users: UserLite[]
  ): RoleUsersViewModel {
    const sorted = this.sort(users);
    const vm: RoleUsersViewModel = {
      assigned: [],
      unassigned: [],
    };
    if (!users) return vm;
    if (!userIds) {
      vm.unassigned = sorted;

      return vm;
    }

    for (const user of users) {
      if (userIds.indexOf(user.id) > -1) {
        vm.assigned.push(user);
      } else if (user.roles.indexOf(roleId) > -1) {
        vm.unassigned.push(user);
      }
    }

    return vm;
  }

  private sort(list: UserLite[]): UserLite[] {
    return list.sort((a, b) => (a.name > b.name ? 1 : -1));
  }
}
