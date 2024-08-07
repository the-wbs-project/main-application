import { Env } from '../../../config';
import { Member, Organization, Role, User } from '../../../models';
import { Fetcher } from '../../fetcher.service';
import { Logger } from '../../logging';
import { Auth0InviteService } from './invite.service';
import { Auth0MembershipService } from './membership.service';
import { Auth0OrganizationService } from './organization.service';
import { Auth0RoleService } from './role.service';
import { Auth0TokenService } from './token.service';
import { Auth0UserService } from './user.service';

export class Auth0Service {
  private readonly tokenService: Auth0TokenService;

  readonly invites: Auth0InviteService;
  readonly memberships: Auth0MembershipService;
  readonly organizations: Auth0OrganizationService;
  readonly roles: Auth0RoleService;
  readonly users: Auth0UserService;

  constructor(env: Env, fetcher: Fetcher, logger: Logger) {
    this.tokenService = new Auth0TokenService(env, fetcher, logger);
    this.invites = new Auth0InviteService(env, fetcher, logger, this.tokenService);
    this.memberships = new Auth0MembershipService(env, fetcher, logger, this.tokenService);
    this.organizations = new Auth0OrganizationService(env, fetcher, logger, this.tokenService);
    this.roles = new Auth0RoleService(env, fetcher, logger, this.tokenService);
    this.users = new Auth0UserService(env, fetcher, logger, this.tokenService);
  }
}
