import { Pipe, PipeTransform } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faQuestion } from '@fortawesome/pro-solid-svg-icons';
import { ROLES, ROLES_TYPE } from '@wbs/core/models';
import { ROLE_ICONS } from 'src/environments/icons';

@Pipe({ name: 'roleIcon' })
export class RoleIconPipe implements PipeTransform {
  transform(role: ROLES_TYPE, defaultIcon = faQuestion): IconDefinition {
    if (role === ROLES.APPROVER) return ROLE_ICONS.approver;
    if (role === ROLES.PM) return ROLE_ICONS.pm;
    if (role === ROLES.SME) return ROLE_ICONS.sme;

    return defaultIcon;
  }
}
