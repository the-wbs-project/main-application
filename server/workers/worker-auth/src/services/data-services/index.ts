import { Auth0Service } from '../api-services';
import { Logger } from '../logging';
import { InviteDataService } from './invite.data-service';
import { MembershipDataService } from './membership.data-service';
import { OrganizationDataService } from './organization.data-service';
import { RoleDataService } from './roles.data-service';
import { UserDataService } from './user.data-service';

export class DataServiceFactory {
  readonly invites: InviteDataService;
  readonly memberships: MembershipDataService;
  readonly organizations: OrganizationDataService;
  readonly roles: RoleDataService;
  readonly users: UserDataService;

  constructor(auth0: Auth0Service, logger: Logger, kv: KVNamespace, ctx: ExecutionContext) {
    this.invites = new InviteDataService(auth0);
    this.memberships = new MembershipDataService(auth0, kv, ctx);
    this.organizations = new OrganizationDataService(auth0, kv, ctx);
    this.roles = new RoleDataService(auth0, kv, ctx);
    this.users = new UserDataService(auth0, logger, kv, ctx);
  }
}
