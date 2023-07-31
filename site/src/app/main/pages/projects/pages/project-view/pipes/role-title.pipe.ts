import { Pipe, PipeTransform } from '@angular/core';
import { ROLES } from '@wbs/core/models';
import { ProjectHelperService } from '../../../services';

@Pipe({ name: 'roleTitle', standalone: true })
export class RoleTitlePipe implements PipeTransform {
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
      titles.push(
        ProjectHelperService.getRoleTitle(ROLES.PM, useAbbreviations)
      );
    }
    if (isApprover) {
      titles.push(
        ProjectHelperService.getRoleTitle(ROLES.APPROVER, useAbbreviations)
      );
    }
    if (isSme) {
      titles.push(
        ProjectHelperService.getRoleTitle(ROLES.SME, useAbbreviations)
      );
    }
    return titles.join(', ');
  }
}
