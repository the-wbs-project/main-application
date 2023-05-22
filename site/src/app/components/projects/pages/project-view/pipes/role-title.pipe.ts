import { inject, Pipe, PipeTransform } from '@angular/core';
import { ProjectHelperService } from '@wbs/components/projects/services';
import { ROLES } from '@wbs/core/models';

@Pipe({ name: 'roleTitle' })
export class RoleTitlePipe implements PipeTransform {
  private readonly helper = inject(ProjectHelperService);

  transform(
    input: string | string[] | undefined | null,
    useAbbreviations = false
  ): string {
    if (!input) return '';

    const roles = Array.isArray(input) ? input : [input];
    const titles: string[] = [];
    const isApprover = roles.indexOf(ROLES.APPROVER) > -1;
    const isPm = roles.indexOf(ROLES.PM) > -1;
    const isSme = roles.indexOf(ROLES.SME) > -1;

    if (isPm) {
      titles.push(this.helper.getRoleTitle(ROLES.PM, useAbbreviations));
    }
    if (isApprover) {
      titles.push(this.helper.getRoleTitle(ROLES.APPROVER, useAbbreviations));
    }
    if (isSme) {
      titles.push(this.helper.getRoleTitle(ROLES.SME, useAbbreviations));
    }
    return titles.join(', ');
  }
}
