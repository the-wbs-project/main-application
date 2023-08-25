import { Injectable } from '@angular/core';
import { Member, ROLES_TYPE } from '@wbs/core/models';
import { sorter } from '@wbs/core/services';
import { RoleUsersViewModel } from '../view-models';

@Injectable()
export class RoleUsersService {
  get(
    roleId: ROLES_TYPE,
    userIds: string[] | undefined,
    members: Member[]
  ): RoleUsersViewModel {
    const sorted = members?.sort((a, b) => sorter(a.name, b.name)) ?? [];
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
      } else if (member.roles.includes(roleId)) {
        vm.unassigned.push(member);
      }
    }

    return vm;
  }
}
