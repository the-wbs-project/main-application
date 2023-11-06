export const PROJECT_CLAIMS = {
  READ: 'read:project',
  CREATE: 'create:project',
  UPDATE: 'update:project',
  DELETE: 'delete:project',

  SETTINGS: {
    READ: 'read:project_settings',
  },
  TASKS: {
    READ: 'read:project_tasks',
    CREATE: 'create:project_tasks',
    UPDATE: 'update:project_tasks',
    DELETE: 'delete:project_tasks',
  },
  ROLES: {
    READ: 'read:project_roles',
    CREATE: 'create:project_roles',
    UPDATE: 'update:project_roles',
    DELETE: 'delete:project_roles',
  },
  RESOURCES: {
    READ: 'read:project_resources',
    CREATE: 'create:project_resources',
    UPDATE: 'update:project_resources',
    DELETE: 'delete:project_resources',
  },
  APPROVAL: {
    CAN_APPROVE: 'update:approve:project',
    CAN_COMMENT: 'comment:approve:project',
  },
};
