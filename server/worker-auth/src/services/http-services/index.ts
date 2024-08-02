import { MembershipHttpService } from './membership.http-service';
import { OrganizationHttpService } from './organization.http-service';
import { UserHttpService } from './user.http-service';

export const Http = {
  memberships: MembershipHttpService,
  organizations: OrganizationHttpService,
  users: UserHttpService,
};
