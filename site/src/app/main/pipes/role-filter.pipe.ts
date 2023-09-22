import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { RolesState } from '@wbs/main/states';

@Pipe({ name: 'roleFilter', standalone: true })
export class RoleFilterPipe implements PipeTransform {
  constructor(private readonly store: Store) {}

  transform(
    roleNames: string[] | undefined,
    userRoles: string[] | undefined
  ): boolean {
    if (roleNames === undefined || roleNames.length === 0) return true;
    if (userRoles === undefined) return false;

    const roles = this.store
      .selectSnapshot(RolesState.definitions)
      .filter((r) => roleNames.includes(r.name))
      .map((r) => r.id);

    return roles.some((r) => userRoles.includes(r));
  }
}
