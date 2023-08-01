import { Pipe, PipeTransform } from '@angular/core';
import { ROLES } from '@wbs/core/models';
import { ProjectService } from '@wbs/core/services';

@Pipe({ name: 'roleTitle', standalone: true })
export class RoleTitlePipe implements PipeTransform {
  constructor(private readonly service: ProjectService) {}

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
      titles.push(this.service.getRoleTitle(ROLES.PM, useAbbreviations));
    }
    if (isApprover) {
      titles.push(this.service.getRoleTitle(ROLES.APPROVER, useAbbreviations));
    }
    if (isSme) {
      titles.push(this.service.getRoleTitle(ROLES.SME, useAbbreviations));
    }
    return titles.join(', ');
  }
}
