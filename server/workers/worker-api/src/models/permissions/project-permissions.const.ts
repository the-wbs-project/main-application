import { ROLES } from '../roles.enum';
import { Permissions } from './permissions.type';
import { PROJECT_CLAIMS } from './project-claims.const';

const permissions: Permissions = {};

const OWNER = 'owner';
const VIEWER = 'viewer';

permissions[PROJECT_CLAIMS.READ] = [ROLES.PM, ROLES.ADMIN, ROLES.APPROVER, ROLES.SME];
permissions[PROJECT_CLAIMS.CREATE] = [ROLES.PM, ROLES.ADMIN];
permissions[PROJECT_CLAIMS.UPDATE] = [ROLES.PM, ROLES.ADMIN];
permissions[PROJECT_CLAIMS.DELETE] = [ROLES.PM];

permissions[PROJECT_CLAIMS.SETTINGS.READ] = [ROLES.PM, ROLES.ADMIN];

permissions[PROJECT_CLAIMS.TASKS.READ] = [ROLES.PM, ROLES.ADMIN, ROLES.APPROVER, ROLES.SME];
permissions[PROJECT_CLAIMS.TASKS.CREATE] = [ROLES.PM, ROLES.ADMIN];
permissions[PROJECT_CLAIMS.TASKS.UPDATE] = [ROLES.PM, ROLES.ADMIN];
permissions[PROJECT_CLAIMS.TASKS.DELETE] = [ROLES.PM, ROLES.ADMIN];

permissions[PROJECT_CLAIMS.ROLES.READ] = [ROLES.PM, ROLES.ADMIN];
permissions[PROJECT_CLAIMS.ROLES.CREATE] = [ROLES.PM, ROLES.ADMIN];
permissions[PROJECT_CLAIMS.ROLES.UPDATE] = [ROLES.PM, ROLES.ADMIN];
permissions[PROJECT_CLAIMS.ROLES.DELETE] = [ROLES.PM, ROLES.ADMIN];

permissions[PROJECT_CLAIMS.RESOURCES.READ] = [ROLES.PM, ROLES.ADMIN];
permissions[PROJECT_CLAIMS.RESOURCES.CREATE] = [ROLES.PM, ROLES.ADMIN];
permissions[PROJECT_CLAIMS.RESOURCES.UPDATE] = [ROLES.PM, ROLES.ADMIN];
permissions[PROJECT_CLAIMS.RESOURCES.DELETE] = [ROLES.PM, ROLES.ADMIN];

permissions[PROJECT_CLAIMS.APPROVAL.CAN_APPROVE] = [ROLES.APPROVER];
permissions[PROJECT_CLAIMS.APPROVAL.CAN_COMMENT] = [ROLES.PM, ROLES.ADMIN, ROLES.SME, ROLES.APPROVER];

permissions[PROJECT_CLAIMS.STATI.CAN_SUBMIT_FOR_APPROVAL] = [ROLES.PM, ROLES.ADMIN];
permissions[PROJECT_CLAIMS.STATI.CAN_RETURN_TO_PLANNING] = [ROLES.PM, ROLES.ADMIN];
permissions[PROJECT_CLAIMS.STATI.CAN_APPROVE] = [ROLES.APPROVER];
permissions[PROJECT_CLAIMS.STATI.CAN_REJECT] = [ROLES.APPROVER];
permissions[PROJECT_CLAIMS.STATI.CAN_CANCEL] = [ROLES.PM, ROLES.APPROVER, ROLES.ADMIN];

export const PROJECT_PERMISSIONS = permissions;