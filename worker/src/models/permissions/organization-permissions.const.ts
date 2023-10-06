import { ROLES } from '../roles.enum';
import { ORGANIZATION_CLAIMS } from './organization-claims.const';
import { Permissions } from './permissions.type';

const permissions: Permissions = {};

permissions[ORGANIZATION_CLAIMS.SETTINGS.READ] = [ROLES.ADMIN];

permissions[ORGANIZATION_CLAIMS.MEMBERS.READ] = [ROLES.ADMIN];
permissions[ORGANIZATION_CLAIMS.MEMBERS.CREATE] = [ROLES.ADMIN];
permissions[ORGANIZATION_CLAIMS.MEMBERS.UPDATE] = [ROLES.ADMIN];
permissions[ORGANIZATION_CLAIMS.MEMBERS.DELETE] = [ROLES.ADMIN];

export const ORGANZIATION_PERMISSIONS = permissions;
