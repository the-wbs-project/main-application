import { Member, Organization } from '@wbs/core/models';

export class InitiateOrganizations {
  static readonly type = '[Membership] Load';
  constructor(readonly organizations: Organization[]) {}
}

export class ChangeOrganization {
  static readonly type = '[Membership] Change';
  constructor(readonly organization: Organization) {}
}
