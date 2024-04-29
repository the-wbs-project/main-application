import { Pipe, PipeTransform, inject } from '@angular/core';
import { Role } from '@wbs/core/models';
import { sorter } from '@wbs/core/services';
import { MetadataStore } from '@wbs/store';

@Pipe({ name: 'roleList', standalone: true })
export class RoleListPipe implements PipeTransform {
  private readonly metadata = inject(MetadataStore);

  transform(
    roles: (Role | string)[] | undefined | null,
    useAbbreviations = false
  ): string {
    if (!roles) return '';

    const list: string[] = [];
    const defintions = this.metadata.roles.definitions;

    for (const role of roles) {
      const roleId = typeof role === 'string' ? role : role.id;

      const definition = defintions.find(
        (x) => x.id === roleId || x.name === roleId
      );

      if (!definition) continue;

      list.push(
        useAbbreviations ? definition.abbreviation : definition.description
      );
    }
    return list.sort((a, b) => sorter(a, b)).join(', ');
  }
}
