import { inject, Injectable } from '@angular/core';
import { ROLES } from '@wbs/core/models';
import { Resources } from '@wbs/core/services';

@Injectable()
export class ProjectHelperService {
  private readonly resources = inject(Resources);

  getRoleTitle(
    role: string | undefined | null,
    useAbbreviations = false
  ): string {
    if (!role) return '';

    const suffix = useAbbreviations ? '' : '-Full';

    if (role === ROLES.ADMIN)
      return this.resources.get('General.Admin' + suffix);
    if (role === ROLES.PM) return this.resources.get('General.PM' + suffix);
    if (role === ROLES.APPROVER) return this.resources.get('General.Approver');
    if (role === ROLES.SME) return this.resources.get('General.SME' + suffix);

    return '';
  }
}
