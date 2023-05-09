import { inject, Pipe, PipeTransform } from '@angular/core';
import { ProjectHelperService } from '@wbs/components/projects/services';

@Pipe({ name: 'roleTitle' })
export class RoleTitlePipe implements PipeTransform {
  private readonly helper = inject(ProjectHelperService);

  transform(
    roles: string | string[] | undefined | null,
    useAbbreviations = false
  ): string {
    if (Array.isArray(roles)) {
      const list: string[] = [];

      for (const role of roles)
        list.push(this.helper.getRoleTitle(role, useAbbreviations));

      return list.join(', ');
    }
    return this.helper.getRoleTitle(roles, useAbbreviations);
  }
}
