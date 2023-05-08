import { inject, Pipe, PipeTransform } from '@angular/core';
import { ProjectHelperService } from '@wbs/components/projects/services';

@Pipe({ name: 'roleTitle' })
export class RoleTitlePipe implements PipeTransform {
  private readonly helper = inject(ProjectHelperService);

  transform(role: string | undefined | null, useAbbreviations = false): string {
    return this.helper.getRoleTitle(role, useAbbreviations);
  }
}
