import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { sorter } from '@wbs/core/services';
import { RolesState } from '../states';

@Pipe({ name: 'roleList', standalone: true })
export class RoleListPipe implements PipeTransform {
  constructor(private readonly store: Store) {}

  transform(
    roles: string[] | undefined | null,
    useAbbreviations = false
  ): string {
    if (!roles) return '';

    const list: string[] = [];
    const defintions = this.store.selectSnapshot(RolesState.definitions);

    for (const role of roles) {
      const definition = defintions.find(
        (x) => x.id === role || x.name === role
      );

      if (!definition) continue;

      list.push(
        useAbbreviations ? definition.abbreviation : definition.description
      );
    }
    return list.sort((a, b) => sorter(a, b)).join(', ');
  }
}
