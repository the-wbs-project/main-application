import { Injectable } from '@angular/core';
import { ROLES_TYPE, Role, UserLite } from '@wbs/core/models';
import { sorter } from '@wbs/core/services';
import { RoleUsersViewModel } from './view-models/role-users.view-model';

@Injectable()
export class RoleUsersService {
  get(
    roleId: ROLES_TYPE,
    userIds: string[] | undefined,
    members: UserLite[],
    memberRoles: Record<string, Role[]>
  ): RoleUsersViewModel {
    const sorted = members.sort((a, b) => sorter(a.name, b.name));
    const vm: RoleUsersViewModel = {
      assigned: [],
      unassigned: [],
    };
    if (!members) return vm;
    if (!userIds) {
      vm.unassigned = sorted;

      return vm;
    }

    for (const member of members) {
      if (userIds.indexOf(member.id) > -1) {
        vm.assigned.push(member);
      } else if (memberRoles[member.id]?.find((x) => x.id === roleId)) {
        vm.unassigned.push(member);
      }
    }

    return vm;
  }
}
