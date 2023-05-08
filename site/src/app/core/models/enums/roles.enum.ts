export enum ROLES {
  PM = 'pm',
  APPROVER = 'approver',
  SME = 'sme',
  ADMIN = 'admin',
}
export const ROLES_CONST = {
  PM: ROLES.PM,
  APPROVER: ROLES.APPROVER,
  SME: ROLES.SME,
  ADMIN: ROLES.ADMIN,
};

export type ROLES_TYPE = ROLES.PM | ROLES.APPROVER | ROLES.SME | ROLES.ADMIN;
