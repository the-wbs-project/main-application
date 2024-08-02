import { Auth0Service } from '../api-services';
import { MembershipDataService } from './membership.data-service';
import { OrganizationDataService } from './organization.data-service';
import { UserDataService } from './user.data-service';

export class DataServiceFactory {
  readonly memberships: MembershipDataService;
  readonly organizations: OrganizationDataService;
  readonly users: UserDataService;

  constructor(auth0: Auth0Service, kv: KVNamespace, ctx: ExecutionContext) {
    this.memberships = new MembershipDataService(auth0, kv, ctx);
    this.organizations = new OrganizationDataService(auth0, kv, ctx);
    this.users = new UserDataService(auth0, kv, ctx);
  }
}
