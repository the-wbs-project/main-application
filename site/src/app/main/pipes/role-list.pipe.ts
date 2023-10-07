import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { Resources, sorter } from '@wbs/core/services';
import { PermissionsState } from '../states';
import { Role } from '@wbs/core/models';

@Pipe({ name: 'roleList', standalone: true })
export class RoleListPipe implements PipeTransform {
  constructor(
    private readonly resources: Resources,
    private readonly store: Store
  ) {}

  transform(
    roles: (Role | string)[] | undefined | null,
    useAbbreviations = false
  ): string {
    if (!roles) return '';

    const list: string[] = [];
    const defintions = this.store.selectSnapshot(
      PermissionsState.roleDefinitions
    );

    for (const role of roles) {
      const roleId = typeof role === 'string' ? role : role.id;

      const definition = defintions.find(
        (x) => x.id === roleId || x.name === roleId
      );

      if (!definition) continue;

      list.push(
        this.resources.get(
          useAbbreviations ? definition.abbreviation : definition.description
        )
      );
    }
    return list.sort((a, b) => sorter(a, b)).join(', ');
  }
}
