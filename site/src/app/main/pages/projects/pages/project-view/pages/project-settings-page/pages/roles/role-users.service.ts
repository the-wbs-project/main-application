import { Injectable } from '@angular/core';
import { ROLES_TYPE, UserLite } from '@wbs/core/models';
import { sorter } from '@wbs/core/services';
import { RoleUsersViewModel } from './view-models/role-users.view-model';

@Injectable()
export class RoleUsersService {
  get(
    roleId: ROLES_TYPE,
    userIds: string[] | undefined,
    users: UserLite[]
  ): RoleUsersViewModel {
    const sorted = users.sort((a, b) => sorter(a.name, b.name));
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
}
