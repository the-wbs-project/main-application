import { Pipe, PipeTransform } from '@angular/core';
import { ROLES } from '@wbs/shared/models';
import { Resources } from '@wbs/shared/services';

@Pipe({ name: 'rolesList', pure: true })
export class RolesListPipe implements PipeTransform {
  constructor(private readonly resources: Resources) {}

  transform(
    roles: string[] | undefined | null,
    useAbbreviations = false
  ): string {
    if (!roles) return '';

    const list: string[] = [];

    if (roles.indexOf(ROLES.ADMIN) > -1)
      list.push(
        this.resources.get('General.Admin' + (useAbbreviations ? '' : '-Full'))
      );

    if (roles.indexOf(ROLES.PM) > -1)
      list.push(
        this.resources.get('General.PM' + (useAbbreviations ? '' : '-Full'))
      );

    if (roles.indexOf(ROLES.APPROVER) > -1)
      list.push(this.resources.get('General.Approver'));

    if (roles.indexOf(ROLES.SME) > -1)
      list.push(
        this.resources.get('General.SME' + (useAbbreviations ? '' : '-Full'))
      );

    return list.join(', ');
  }
}
