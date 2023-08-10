import { Organization } from '@wbs/core/models';

export class LoadOrganizations {
  static readonly type = '[Membership] Load';
}

export class ChangeOrganization {
  static readonly type = '[Membership] Change';
  constructor(readonly organization: Organization) {}
}
