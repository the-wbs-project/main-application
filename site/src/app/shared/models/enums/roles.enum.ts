export enum ROLES {
  PM = 'pm',
  APPROVER = 'approver',
  SME = 'sme',
  ADMIN = 'admin',
}

export type ROLES_TYPE = ROLES.PM | ROLES.APPROVER | ROLES.SME | ROLES.ADMIN;
