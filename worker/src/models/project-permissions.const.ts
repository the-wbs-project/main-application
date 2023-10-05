import { PROJECT_PERMISSION_KEYS } from './project-permission-keys.enum';
import { ROLES } from './roles.enum';

const permissions: { [key: string]: string[] } = {};

permissions[PROJECT_PERMISSION_KEYS.CAN_EDIT_TASKS] = [ROLES.PM];
permissions[PROJECT_PERMISSION_KEYS.CAN_EDIT_METADATA] = [ROLES.PM];
permissions[PROJECT_PERMISSION_KEYS.CAN_EDIT_ROLES] = [ROLES.PM, ROLES.ADMIN];

export const PROJECT_PERMISSIONS = permissions;
