import { InviteEntrypoint } from './invite.entrypoint';
import { MembershipsEntrypoint } from './memberships.entrypoint';
import { OrganizationsEntrypoint } from './organizations.entrypoint';
import { RolesEntrypoint } from './roles.entrypoint';
import { UsersEntrypoint } from './users.entrypoint';
import { UtilsEntrypoint } from './utils.entrypoint';

export interface AuthEntrypoint {
  invites(): Promise<InviteEntrypoint>;
  memberships(): Promise<MembershipsEntrypoint>;
  organizations(): Promise<OrganizationsEntrypoint>;
  roles(): Promise<RolesEntrypoint>;
  users(): Promise<UsersEntrypoint>;
  utils(): Promise<UtilsEntrypoint>;
}
