import { inject, Injectable } from '@angular/core';
import { ROLES } from '@wbs/core/models';
import { Resources } from '@wbs/core/services';

@Injectable()
export class ProjectHelperService {
  static getRoleTitle(
    role: string | undefined | null,
    useAbbreviations = false
  ): string {
    if (!role) return '';

    const resources = inject(Resources);
    const suffix = useAbbreviations ? '' : '-Full';

    if (role === ROLES.ADMIN) return resources.get('General.Admin' + suffix);
    if (role === ROLES.PM) return resources.get('General.PM' + suffix);
    if (role === ROLES.APPROVER) return resources.get('General.Approver');
    if (role === ROLES.SME) return resources.get('General.SME' + suffix);

    return '';
  }
}
